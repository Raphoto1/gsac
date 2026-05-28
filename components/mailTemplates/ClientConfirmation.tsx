interface ClientConfirmationProps {
  name: string;
  companyName: string;
}

export function ClientConfirmation({ name, companyName }: ClientConfirmationProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "24px",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "32px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{
            color: "#111827",
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Hemos recibido tu mensaje
        </h2>

        <p style={{ color: "#374151", lineHeight: "1.6", marginBottom: "16px" }}>
          Hola <strong>{name}</strong>,
        </p>

        <p style={{ color: "#374151", lineHeight: "1.6", marginBottom: "16px" }}>
          Gracias por contactarte con <strong>{companyName}</strong>. Hemos recibido
          tu solicitud y uno de nuestros asesores se pondrá en contacto contigo a la
          brevedad posible.
        </p>

        <p style={{ color: "#374151", lineHeight: "1.6", marginBottom: "0" }}>
          Si tienes alguna pregunta adicional, no dudes en escribirnos nuevamente.
        </p>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e5e7eb",
            margin: "24px 0",
          }}
        />

        <p style={{ color: "#9ca3af", fontSize: "12px", margin: 0 }}>
          Este es un mensaje automático, por favor no respondas a este correo.
        </p>
      </div>
    </div>
  );
}
