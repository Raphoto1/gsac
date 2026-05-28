import { NextResponse } from "next/server";
import { Resend } from "resend";
import { OwnerNotification } from "@/components/mailTemplates/OwnerNotification";
import { ClientConfirmation } from "@/components/mailTemplates/ClientConfirmation";
import { getContactInfoFromDb } from "@/apiPack/dao/contact.dao";
import { createContactSubmissionService } from "@/apiPack/service/contact-submission.service";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FROM_EMAIL =
    process.env.RESEND_FROM_EMAIL ?? "noreply@gsac.com.co";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const name: string = (body.name ?? "").trim();
        const email: string = (body.email ?? "").trim().toLowerCase();
        const company: string = (body.company ?? "").trim();
        const message: string = (body.message ?? "").trim();

        if (!name || name.length < 2) {
            return NextResponse.json({ error: "Invalid name" }, { status: 400 });
        }
        if (!email || !EMAIL_REGEX.test(email)) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }
        if (!message || message.length < 10) {
            return NextResponse.json({ error: "Invalid message" }, { status: 400 });
        }

        // 1. Get owner email from DB
        const contactInfo = await getContactInfoFromDb();
        const ownerEmail = contactInfo.email;
        const companyName = contactInfo.companyName;
        const date = new Date().toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        // 2. Send notification to owner — capture resendId
        const { data: ownerData, error: ownerError } = await resend.emails.send({
            from: FROM_EMAIL,
            to: ownerEmail,
            subject: `Nueva solicitud de contacto de ${name}`,
            react: OwnerNotification({
                name,
                email,
                company,
                message,
                resendId: "", // placeholder; updated after we have the id
                date,
            }),
        });

        if (ownerError || !ownerData) {
            console.error("Error sending owner notification:", ownerError);
            return NextResponse.json(
                { error: "Failed to send notification" },
                { status: 500 }
            );
        }

        const resendId = ownerData.id;

        // 3. Save submission to DB with the Resend message id as tracking code
        await createContactSubmissionService({
            name,
            email,
            company,
            message,
            resendId,
        });

        // 4. Send confirmation to client (best-effort — don't fail the request if this errors)
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: email,
                subject: `Hemos recibido tu mensaje — ${companyName}`,
                react: ClientConfirmation({ name, companyName }),
            });
        } catch (clientEmailErr) {
            console.error("Error sending client confirmation:", clientEmailErr);
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error processing contact form:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}