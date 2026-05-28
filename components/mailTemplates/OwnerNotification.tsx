interface OwnerNotificationProps {
  name: string;
  email: string;
  company: string;
  message: string;
  resendId: string;
  date: string;
}

export function OwnerNotification({
  name,
  email,
  company,
  message,
  resendId,
  date,
}: OwnerNotificationProps) {
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
            marginBottom: "8px",
          }}
        >
          Nueva solicitud de contacto
        </h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
          Recibida el {date}
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  fontWeight: "bold",
                  color: "#374151",
                  width: "120px",
                  verticalAlign: "top",
                }}
              >
                Nombre:
              </td>
              <td style={{ padding: "8px 0", color: "#111827" }}>{name}</td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  fontWeight: "bold",
                  color: "#374151",
                  verticalAlign: "top",
                }}
              >
                Email:
              </td>
              <td style={{ padding: "8px 0", color: "#111827" }}>
                <a href={`mailto:${email}`} style={{ color: "#2563eb" }}>
                  {email}
                </a>
              </td>
            </tr>
            {company && (
              <tr>
                <td
                  style={{
                    padding: "8px 0",
                    fontWeight: "bold",
                    color: "#374151",
                    verticalAlign: "top",
                  }}
                >
                  Empresa:
                </td>
                <td style={{ padding: "8px 0", color: "#111827" }}>{company}</td>
              </tr>
            )}
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  fontWeight: "bold",
                  color: "#374151",
                  verticalAlign: "top",
                }}
              >
                Mensaje:
              </td>
              <td style={{ padding: "8px 0", color: "#111827", lineHeight: "1.6" }}>
                {message}
              </td>
            </tr>
          </tbody>
        </table>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "24px 0" }} />

        <p style={{ color: "#9ca3af", fontSize: "12px", margin: 0 }}>
          Referencia interna: <code style={{ color: "#6b7280" }}>{resendId}</code>
        </p>
      </div>
    </div>
  );
}
