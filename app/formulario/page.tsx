import type { Metadata } from "next";
import QualificationForm from "./QualificationForm";

export const metadata: Metadata = {
  title: "Qualificação — Investidor Protegido",
  description: "Formulário de qualificação para Consultor Comercial.",
};

export default function FormularioPage() {
  return <QualificationForm />;
}
