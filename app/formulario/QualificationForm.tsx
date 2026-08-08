"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./formulario.module.css";

const STEP_META = [
  { label: "Dados pessoais", progress: 9 },
  { label: "Localização e redes", progress: 18 },
  { label: "Atuação profissional", progress: 27 },
  { label: "Experiência comercial", progress: 36 },
  { label: "Carteira de clientes", progress: 45 },
  { label: "Certificações", progress: 55 },
  { label: "Disponibilidade", progress: 64 },
  { label: "Momento financeiro", progress: 73 },
  { label: "Motivação", progress: 82 },
  { label: "Autoavaliação", progress: 91 },
  { label: "Revisão", progress: 100 },
] as const;

const STATES = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará",
  "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão",
  "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará",
  "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro",
  "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima",
  "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
] as const;

const CURRENT_AREAS = [
  "Mercado financeiro", "Consórcio", "Seguro", "Imóveis",
  "Representação comercial", "Vendas internas", "Empreendedor", "Outro",
] as const;

const SALES_TIME = [
  "Nunca vendi", "Menos de 1 ano", "De 1 a 3 anos", "De 3 a 5 anos", "Mais de 5 anos",
] as const;

const EXPERIENCE_AREAS = [
  "Consórcio", "Seguro", "Previdência", "Investimentos", "Crédito",
  "Imóveis", "Empresas", "B2B", "Alta renda",
] as const;

const CLIENT_RANGES = [
  "Até 20", "De 21 a 50", "De 51 a 100", "De 101 a 300", "Mais de 300",
] as const;

const CERTIFICATIONS = ["CPA-10", "CPA-20", "CEA", "CFP", "ANCORD", "SUSEP", "Nenhuma"] as const;

const WEEKLY_HOURS = [
  "Até 10 horas por semana", "De 11 a 20 horas", "De 21 a 30 horas",
  "De 31 a 40 horas", "Mais de 40 horas",
] as const;

const INCOME_RANGES = [
  "Até R$ 2 mil", "De R$ 2 mil a R$ 5 mil", "De R$ 5 mil a R$ 10 mil",
  "De R$ 10 mil a R$ 20 mil", "Acima de R$ 20 mil",
] as const;

const MOTIVATIONS = ["Ganhar mais", "Mudança de carreira", "Liberdade", "Crescimento", "Mercado financeiro"] as const;

type PersonalData = {
  nome: string;
  idade: string;
  email: string;
  telefone: string;
  whatsapp: string;
};

type LocationData = {
  cidade: string;
  estado: string;
  linkedin: string;
  instagram: string;
};

type QualificationData = {
  atuacaoAtual: string[];
  outraAtuacao: string;
  tempoExperienciaComercial: string;
  areasExperiencia: string[];
  possuiCarteira: string;
  quantidadeClientes: string;
  certificacoes: string[];
  horasSemanais: string;
  veiculoProprio: string;
  possuiNotebook: string;
  participaTreinamentos: string;
  rendaAtual: string;
  maiorMotivacao: string;
  habilidadeComercial: number | null;
  rendaDesejada12Meses: string;
};

type FormData = {
  dadosPessoais: PersonalData;
  localizacaoRedes: LocationData;
  qualificacao: QualificationData;
};

type ScreenKey =
  | "nome"
  | "idade"
  | "email"
  | "telefone"
  | "whatsapp"
  | "cidade"
  | "estado"
  | "linkedin"
  | "instagram"
  | "atuacaoAtual"
  | "outraAtuacao"
  | "tempoExperienciaComercial"
  | "areasExperiencia"
  | "possuiCarteira"
  | "quantidadeClientes"
  | "certificacoes"
  | "horasSemanais"
  | "veiculoProprio"
  | "possuiNotebook"
  | "participaTreinamentos"
  | "rendaAtual"
  | "rendaDesejada12Meses"
  | "maiorMotivacao"
  | "habilidadeComercial"
  | "review";

type Screen = {
  key: ScreenKey;
  stage: number;
};

const INITIAL_DATA: FormData = {
  dadosPessoais: { nome: "", idade: "", email: "", telefone: "", whatsapp: "" },
  localizacaoRedes: { cidade: "", estado: "", linkedin: "", instagram: "" },
  qualificacao: {
    atuacaoAtual: [],
    outraAtuacao: "",
    tempoExperienciaComercial: "",
    areasExperiencia: [],
    possuiCarteira: "",
    quantidadeClientes: "",
    certificacoes: [],
    horasSemanais: "",
    veiculoProprio: "",
    possuiNotebook: "",
    participaTreinamentos: "",
    rendaAtual: "",
    maiorMotivacao: "",
    habilidadeComercial: null,
    rendaDesejada12Meses: "",
  },
};

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type ChoiceProps = {
  checked: boolean;
  children: ReactNode;
  name: string;
  onChange: () => void;
  type: "checkbox" | "radio";
};

function Choice({ checked, children, name, onChange, type }: ChoiceProps) {
  return (
    <label className={`${styles.choice} ${checked ? styles.choiceSelected : ""}`}>
      <input checked={checked} name={name} onChange={onChange} type={type} />
      <span className={styles.choiceMark} aria-hidden="true" />
      <span>{children}</span>
    </label>
  );
}

function phoneMask(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function currencyMask(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (!digits) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(digits) / 100);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hasValidPhone(value: string) {
  return value.replace(/\D/g, "").length === 11;
}

export default function QualificationForm() {
  const [currentKey, setCurrentKey] = useState<ScreenKey>("nome");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [sameWhatsapp, setSameWhatsapp] = useState(false);
  const [consent, setConsent] = useState(false);
  const [returnToReviewStage, setReturnToReviewStage] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  const screens = useMemo<Screen[]>(() => {
    const result: Screen[] = [
      { key: "nome", stage: 1 },
      { key: "idade", stage: 1 },
      { key: "email", stage: 1 },
      { key: "telefone", stage: 1 },
      { key: "whatsapp", stage: 1 },
      { key: "cidade", stage: 2 },
      { key: "estado", stage: 2 },
      { key: "linkedin", stage: 2 },
      { key: "instagram", stage: 2 },
      { key: "atuacaoAtual", stage: 3 },
    ];

    if (data.qualificacao.atuacaoAtual.includes("Outro")) {
      result.push({ key: "outraAtuacao", stage: 3 });
    }

    result.push(
      { key: "tempoExperienciaComercial", stage: 4 },
      { key: "areasExperiencia", stage: 4 },
      { key: "possuiCarteira", stage: 5 },
    );

    if (data.qualificacao.possuiCarteira === "Sim") {
      result.push({ key: "quantidadeClientes", stage: 5 });
    }

    result.push(
      { key: "certificacoes", stage: 6 },
      { key: "horasSemanais", stage: 7 },
      { key: "veiculoProprio", stage: 7 },
      { key: "possuiNotebook", stage: 7 },
      { key: "participaTreinamentos", stage: 7 },
      { key: "rendaAtual", stage: 8 },
      { key: "rendaDesejada12Meses", stage: 8 },
      { key: "maiorMotivacao", stage: 9 },
      { key: "habilidadeComercial", stage: 10 },
      { key: "review", stage: 11 },
    );

    return result;
  }, [data.qualificacao.atuacaoAtual, data.qualificacao.possuiCarteira]);

  const currentIndex = Math.max(0, screens.findIndex((screen) => screen.key === currentKey));
  const currentScreen = screens[currentIndex];
  const stageMeta = STEP_META[currentScreen.stage - 1];

  const updatePersonal = <K extends keyof PersonalData>(key: K, value: PersonalData[K]) => {
    setData((previous) => ({
      ...previous,
      dadosPessoais: { ...previous.dadosPessoais, [key]: value },
    }));
    clearError(key);
  };

  const updateLocation = <K extends keyof LocationData>(key: K, value: LocationData[K]) => {
    setData((previous) => ({
      ...previous,
      localizacaoRedes: { ...previous.localizacaoRedes, [key]: value },
    }));
    clearError(key);
  };

  const updateQualification = <K extends keyof QualificationData>(key: K, value: QualificationData[K]) => {
    setData((previous) => ({
      ...previous,
      qualificacao: { ...previous.qualificacao, [key]: value },
    }));
    clearError(key);
  };

  function clearError(key: string) {
    setErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  function toggleList(key: "atuacaoAtual" | "areasExperiencia", value: string) {
    const values = data.qualificacao[key];
    const next = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
    updateQualification(key, next);
    if (key === "atuacaoAtual" && value === "Outro" && !next.includes("Outro")) {
      updateQualification("outraAtuacao", "");
    }
  }

  function toggleCertification(value: string) {
    const values = data.qualificacao.certificacoes;
    let next: string[];
    if (value === "Nenhuma") {
      next = values.includes("Nenhuma") ? [] : ["Nenhuma"];
    } else {
      const withoutNone = values.filter((item) => item !== "Nenhuma");
      next = withoutNone.includes(value)
        ? withoutNone.filter((item) => item !== value)
        : [...withoutNone, value];
    }
    updateQualification("certificacoes", next);
  }

  function handlePhone(value: string) {
    const masked = phoneMask(value);
    setData((previous) => ({
      ...previous,
      dadosPessoais: {
        ...previous.dadosPessoais,
        telefone: masked,
        ...(sameWhatsapp ? { whatsapp: masked } : {}),
      },
    }));
    clearError("telefone");
    if (sameWhatsapp) clearError("whatsapp");
  }

  function handleSameWhatsapp(checked: boolean) {
    setSameWhatsapp(checked);
    if (checked) updatePersonal("whatsapp", data.dadosPessoais.telefone);
  }

  function setPortfolioAnswer(value: string) {
    updateQualification("possuiCarteira", value);
    if (value === "Não") updateQualification("quantidadeClientes", "");
  }

  function moveTo(key: ScreenKey, moveDirection: "forward" | "backward") {
    setDirection(moveDirection);
    setCurrentKey(key);
    setErrors({});
    setSubmitError("");
  }

  function validateScreen(key: ScreenKey) {
    const nextErrors: Record<string, string> = {};
    const personal = data.dadosPessoais;
    const location = data.localizacaoRedes;
    const qualification = data.qualificacao;

    if (key === "nome" && !personal.nome.trim()) nextErrors.nome = "Informe seu nome completo.";
    if (key === "idade" && !personal.idade.trim()) nextErrors.idade = "Informe sua idade.";
    if (key === "email" && !isValidEmail(personal.email)) nextErrors.email = "Informe um e-mail válido.";
    if (key === "telefone" && !hasValidPhone(personal.telefone)) {
      nextErrors.telefone = "Informe o telefone no formato (00) 00000-0000.";
    }
    if (key === "whatsapp" && !hasValidPhone(personal.whatsapp)) {
      nextErrors.whatsapp = "Informe o WhatsApp no formato (00) 00000-0000.";
    }
    if (key === "cidade" && !location.cidade.trim()) nextErrors.cidade = "Informe sua cidade.";
    if (key === "estado" && !location.estado) nextErrors.estado = "Selecione seu estado.";
    if (key === "atuacaoAtual" && !qualification.atuacaoAtual.length) {
      nextErrors.atuacaoAtual = "Selecione ao menos uma área de atuação.";
    }
    if (key === "outraAtuacao" && !qualification.outraAtuacao.trim()) {
      nextErrors.outraAtuacao = "Informe sua área de atuação.";
    }
    if (key === "tempoExperienciaComercial" && !qualification.tempoExperienciaComercial) {
      nextErrors.tempoExperienciaComercial = "Selecione seu tempo de experiência comercial.";
    }
    if (key === "areasExperiencia" && !qualification.areasExperiencia.length) {
      nextErrors.areasExperiencia = "Selecione ao menos uma área em que já trabalhou.";
    }
    if (key === "possuiCarteira" && !qualification.possuiCarteira) {
      nextErrors.possuiCarteira = "Informe se possui carteira de clientes.";
    }
    if (key === "quantidadeClientes" && !qualification.quantidadeClientes) {
      nextErrors.quantidadeClientes = "Selecione a quantidade aproximada de clientes.";
    }
    if (key === "certificacoes" && !qualification.certificacoes.length) {
      nextErrors.certificacoes = "Selecione suas certificações ou marque Nenhuma.";
    }
    if (key === "horasSemanais" && !qualification.horasSemanais) {
      nextErrors.horasSemanais = "Selecione sua disponibilidade semanal.";
    }
    if (key === "veiculoProprio" && !qualification.veiculoProprio) {
      nextErrors.veiculoProprio = "Informe se possui veículo próprio.";
    }
    if (key === "possuiNotebook" && !qualification.possuiNotebook) {
      nextErrors.possuiNotebook = "Informe se possui notebook.";
    }
    if (key === "participaTreinamentos" && !qualification.participaTreinamentos) {
      nextErrors.participaTreinamentos = "Informe se participará de treinamentos.";
    }
    if (key === "rendaAtual" && !qualification.rendaAtual) {
      nextErrors.rendaAtual = "Selecione sua renda mensal atual.";
    }
    if (key === "rendaDesejada12Meses" && !qualification.rendaDesejada12Meses) {
      nextErrors.rendaDesejada12Meses = "Informe a renda mensal que deseja alcançar.";
    }
    if (key === "maiorMotivacao" && !qualification.maiorMotivacao) {
      nextErrors.maiorMotivacao = "Selecione sua maior motivação.";
    }
    if (key === "habilidadeComercial" && qualification.habilidadeComercial === null) {
      nextErrors.habilidadeComercial = "Selecione uma nota de 0 a 10.";
    }
    if (key === "review" && !consent) {
      nextErrors.consent = "Você precisa autorizar o tratamento dos dados antes de enviar.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      window.setTimeout(() => {
        document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      }, 0);
      return false;
    }
    return true;
  }

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateScreen(currentKey)) return;

    const nextScreen = screens[currentIndex + 1];
    if (returnToReviewStage !== null) {
      if (nextScreen && nextScreen.stage === returnToReviewStage) {
        moveTo(nextScreen.key, "forward");
      } else {
        setReturnToReviewStage(null);
        moveTo("review", "forward");
      }
      return;
    }

    if (nextScreen) moveTo(nextScreen.key, "forward");
  }

  function handleBack() {
    if (returnToReviewStage !== null) {
      const firstStageIndex = screens.findIndex((screen) => screen.stage === returnToReviewStage);
      if (currentIndex === firstStageIndex) {
        setReturnToReviewStage(null);
        moveTo("review", "backward");
        return;
      }
    }

    const previousScreen = screens[currentIndex - 1];
    if (previousScreen) moveTo(previousScreen.key, "backward");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !validateScreen("review")) return;
    setSubmitting(true);
    setSubmitError("");

    const payload = {
      dadosPessoais: {
        ...data.dadosPessoais,
        idade: Number(data.dadosPessoais.idade),
      },
      localizacaoRedes: data.localizacaoRedes,
      qualificacao: data.qualificacao,
    };

    try {
      const response = await fetch("/api/qualification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("submission-failed");
      setSubmitted(true);
    } catch {
      setSubmitError("Não foi possível enviar sua qualificação agora. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  const reviewBlocks = useMemo(() => {
    const q = data.qualificacao;
    const p = data.dadosPessoais;
    const l = data.localizacaoRedes;
    const currentAreas = q.atuacaoAtual.map((item) => item === "Outro" ? `Outro — ${q.outraAtuacao}` : item);
    return [
      { title: "Dados pessoais", stage: 1, lines: [`Nome: ${p.nome}`, `Idade: ${p.idade}`, `E-mail: ${p.email}`, `Telefone: ${p.telefone}`, `WhatsApp: ${p.whatsapp}`] },
      { title: "Localização e redes", stage: 2, lines: [`Cidade: ${l.cidade}`, `Estado: ${l.estado}`, `LinkedIn: ${l.linkedin || "—"}`, `Instagram: ${l.instagram || "—"}`] },
      { title: "Atuação atual", stage: 3, lines: [currentAreas.join(", ")] },
      { title: "Experiência comercial", stage: 4, lines: [q.tempoExperienciaComercial, q.areasExperiencia.join(", ")] },
      { title: "Carteira de clientes", stage: 5, lines: [q.possuiCarteira, ...(q.possuiCarteira === "Sim" ? [q.quantidadeClientes] : [])] },
      { title: "Certificações", stage: 6, lines: [q.certificacoes.join(", ")] },
      { title: "Estrutura e disponibilidade", stage: 7, lines: [q.horasSemanais, `Veículo próprio: ${q.veiculoProprio}`, `Notebook: ${q.possuiNotebook}`, `Treinamentos: ${q.participaTreinamentos}`] },
      { title: "Momento financeiro", stage: 8, lines: [q.rendaAtual, `Meta mensal: ${q.rendaDesejada12Meses}`] },
      { title: "Motivação", stage: 9, lines: [q.maiorMotivacao] },
      { title: "Autoavaliação", stage: 10, lines: [`Habilidade comercial: ${q.habilidadeComercial}/10`] },
    ];
  }, [data]);

  function errorMessage(key: string) {
    return errors[key] ? <span className={styles.errorMessage} role="alert">{errors[key]}</span> : null;
  }

  function heading(title: string, prompt?: string) {
    return (
      <div className={styles.stepHeading}>
        <h1>{title}</h1>
        {prompt && <p>{prompt}</p>}
      </div>
    );
  }

  function renderScreen() {
    const p = data.dadosPessoais;
    const l = data.localizacaoRedes;
    const q = data.qualificacao;

    switch (currentKey) {
      case "nome":
        return (
          <>
            {heading("Primeiro, fale sobre você")}
            <label className={`${styles.soloField} ${errors.nome ? styles.fieldError : ""}`}>
              <span className={styles.visuallyHidden}>Nome completo</span>
              <input aria-invalid={Boolean(errors.nome)} aria-label="Nome completo" autoComplete="name" autoFocus placeholder="Nome completo" value={p.nome} onChange={(event) => updatePersonal("nome", event.target.value)} />
              {errorMessage("nome")}
            </label>
          </>
        );

      case "idade":
        return (
          <>
            {heading("Primeiro, fale sobre você")}
            <label className={`${styles.soloField} ${errors.idade ? styles.fieldError : ""}`}>
              <span className={styles.visuallyHidden}>Idade</span>
              <input aria-invalid={Boolean(errors.idade)} aria-label="Idade" autoFocus inputMode="numeric" min="0" placeholder="Idade" type="number" value={p.idade} onChange={(event) => updatePersonal("idade", event.target.value)} />
              {errorMessage("idade")}
            </label>
          </>
        );

      case "email":
        return (
          <>
            {heading("Primeiro, fale sobre você")}
            <label className={`${styles.soloField} ${errors.email ? styles.fieldError : ""}`}>
              <span className={styles.visuallyHidden}>E-mail</span>
              <input aria-invalid={Boolean(errors.email)} aria-label="E-mail" autoComplete="email" autoFocus inputMode="email" placeholder="E-mail" type="email" value={p.email} onChange={(event) => updatePersonal("email", event.target.value)} />
              {errorMessage("email")}
            </label>
          </>
        );

      case "telefone":
        return (
          <>
            {heading("Primeiro, fale sobre você")}
            <label className={`${styles.soloField} ${errors.telefone ? styles.fieldError : ""}`}>
              <span className={styles.visuallyHidden}>Telefone</span>
              <input aria-invalid={Boolean(errors.telefone)} aria-label="Telefone" autoComplete="tel" autoFocus inputMode="tel" placeholder="Telefone — (00) 00000-0000" value={p.telefone} onChange={(event) => handlePhone(event.target.value)} />
              {errorMessage("telefone")}
            </label>
          </>
        );

      case "whatsapp":
        return (
          <>
            {heading("Primeiro, fale sobre você")}
            <label className={`${styles.soloField} ${errors.whatsapp ? styles.fieldError : ""}`}>
              <span className={styles.visuallyHidden}>WhatsApp</span>
              <input aria-invalid={Boolean(errors.whatsapp)} aria-label="WhatsApp" autoComplete="tel" autoFocus disabled={sameWhatsapp} inputMode="tel" placeholder="WhatsApp — (00) 00000-0000" value={p.whatsapp} onChange={(event) => updatePersonal("whatsapp", phoneMask(event.target.value))} />
              {errorMessage("whatsapp")}
            </label>
            <label className={styles.syncField}>
              <input checked={sameWhatsapp} onChange={(event) => handleSameWhatsapp(event.target.checked)} type="checkbox" />
              <span aria-hidden="true" />
              Meu telefone também é meu WhatsApp
            </label>
          </>
        );

      case "cidade":
        return (
          <>
            {heading("Onde podemos encontrar você?")}
            <label className={`${styles.soloField} ${errors.cidade ? styles.fieldError : ""}`}>
              <span className={styles.visuallyHidden}>Cidade</span>
              <input aria-invalid={Boolean(errors.cidade)} aria-label="Cidade" autoComplete="address-level2" autoFocus placeholder="Cidade" value={l.cidade} onChange={(event) => updateLocation("cidade", event.target.value)} />
              {errorMessage("cidade")}
            </label>
          </>
        );

      case "estado":
        return (
          <>
            {heading("Onde podemos encontrar você?")}
            <label className={`${styles.soloField} ${errors.estado ? styles.fieldError : ""}`}>
              <span className={styles.visuallyHidden}>Estado</span>
              <select aria-invalid={Boolean(errors.estado)} aria-label="Estado" autoComplete="address-level1" autoFocus value={l.estado} onChange={(event) => updateLocation("estado", event.target.value)}>
                <option value="" disabled>Estado</option>
                {STATES.map((state) => <option key={state}>{state}</option>)}
              </select>
              {errorMessage("estado")}
            </label>
          </>
        );

      case "linkedin":
        return (
          <>
            {heading("Onde podemos encontrar você?")}
            <label className={styles.soloField}>
              <span className={styles.visuallyHidden}>LinkedIn</span>
              <input aria-label="LinkedIn opcional" autoComplete="url" autoFocus placeholder="LinkedIn (opcional)" value={l.linkedin} onChange={(event) => updateLocation("linkedin", event.target.value)} />
            </label>
          </>
        );

      case "instagram":
        return (
          <>
            {heading("Onde podemos encontrar você?")}
            <label className={styles.soloField}>
              <span className={styles.visuallyHidden}>Instagram</span>
              <input aria-label="Instagram opcional" autoComplete="url" autoFocus placeholder="Instagram (opcional)" value={l.instagram} onChange={(event) => updateLocation("instagram", event.target.value)} />
            </label>
          </>
        );

      case "atuacaoAtual":
        return (
          <>
            {heading("Em qual área você trabalha atualmente?", "Atualmente você trabalha com:")}
            <div className={`${styles.choiceList} ${styles.choiceListWide} ${errors.atuacaoAtual ? styles.groupError : ""}`} aria-invalid={Boolean(errors.atuacaoAtual)} tabIndex={-1}>
              {CURRENT_AREAS.map((area) => (
                <Choice checked={q.atuacaoAtual.includes(area)} key={area} name="atuacaoAtual" onChange={() => toggleList("atuacaoAtual", area)} type="checkbox">{area}</Choice>
              ))}
            </div>
            {errorMessage("atuacaoAtual")}
          </>
        );

      case "outraAtuacao":
        return (
          <>
            {heading("Em qual área você trabalha atualmente?")}
            <label className={`${styles.soloField} ${errors.outraAtuacao ? styles.fieldError : ""}`}>
              <span className={styles.visuallyHidden}>Qual é a sua área de atuação?</span>
              <input aria-invalid={Boolean(errors.outraAtuacao)} aria-label="Qual é a sua área de atuação?" autoFocus placeholder="Qual é a sua área de atuação?" value={q.outraAtuacao} onChange={(event) => updateQualification("outraAtuacao", event.target.value)} />
              {errorMessage("outraAtuacao")}
            </label>
          </>
        );

      case "tempoExperienciaComercial":
        return (
          <>
            {heading("Qual é a sua experiência com vendas?", "Quanto tempo possui de experiência comercial?")}
            <div className={`${styles.choiceList} ${errors.tempoExperienciaComercial ? styles.groupError : ""}`} aria-invalid={Boolean(errors.tempoExperienciaComercial)} tabIndex={-1}>
              {SALES_TIME.map((time) => <Choice checked={q.tempoExperienciaComercial === time} key={time} name="tempoExperiencia" onChange={() => updateQualification("tempoExperienciaComercial", time)} type="radio">{time}</Choice>)}
            </div>
            {errorMessage("tempoExperienciaComercial")}
          </>
        );

      case "areasExperiencia":
        return (
          <>
            {heading("Qual é a sua experiência com vendas?", "Com quais áreas você já trabalhou?")}
            <div className={`${styles.choiceList} ${styles.choiceListWide} ${errors.areasExperiencia ? styles.groupError : ""}`} aria-invalid={Boolean(errors.areasExperiencia)} tabIndex={-1}>
              {EXPERIENCE_AREAS.map((area) => <Choice checked={q.areasExperiencia.includes(area)} key={area} name="areasExperiencia" onChange={() => toggleList("areasExperiencia", area)} type="checkbox">{area}</Choice>)}
            </div>
            {errorMessage("areasExperiencia")}
          </>
        );

      case "possuiCarteira":
        return (
          <>
            {heading("Você já possui uma rede de clientes?", "Você possui carteira de clientes?")}
            <div className={`${styles.choiceList} ${styles.choiceListBinary} ${errors.possuiCarteira ? styles.groupError : ""}`} aria-invalid={Boolean(errors.possuiCarteira)} tabIndex={-1}>
              {["Sim", "Não"].map((answer) => <Choice checked={q.possuiCarteira === answer} key={answer} name="possuiCarteira" onChange={() => setPortfolioAnswer(answer)} type="radio">{answer}</Choice>)}
            </div>
            {errorMessage("possuiCarteira")}
          </>
        );

      case "quantidadeClientes":
        return (
          <>
            {heading("Você já possui uma rede de clientes?", "Quantos clientes possui aproximadamente?")}
            <div className={`${styles.choiceList} ${errors.quantidadeClientes ? styles.groupError : ""}`} aria-invalid={Boolean(errors.quantidadeClientes)} tabIndex={-1}>
              {CLIENT_RANGES.map((range) => <Choice checked={q.quantidadeClientes === range} key={range} name="quantidadeClientes" onChange={() => updateQualification("quantidadeClientes", range)} type="radio">{range}</Choice>)}
            </div>
            {errorMessage("quantidadeClientes")}
          </>
        );

      case "certificacoes":
        return (
          <>
            {heading("Você possui alguma certificação profissional?", "Selecione todas as certificações que possui:")}
            <div className={`${styles.choiceList} ${styles.choiceListWide} ${errors.certificacoes ? styles.groupError : ""}`} aria-invalid={Boolean(errors.certificacoes)} tabIndex={-1}>
              {CERTIFICATIONS.map((certification) => <Choice checked={q.certificacoes.includes(certification)} key={certification} name="certificacoes" onChange={() => toggleCertification(certification)} type="checkbox">{certification}</Choice>)}
            </div>
            {errorMessage("certificacoes")}
          </>
        );

      case "horasSemanais":
        return (
          <>
            {heading("Qual é sua disponibilidade para essa oportunidade?", "Quanto tempo você pode dedicar semanalmente?")}
            <div className={`${styles.choiceList} ${errors.horasSemanais ? styles.groupError : ""}`} aria-invalid={Boolean(errors.horasSemanais)} tabIndex={-1}>
              {WEEKLY_HOURS.map((range) => <Choice checked={q.horasSemanais === range} key={range} name="horasSemanais" onChange={() => updateQualification("horasSemanais", range)} type="radio">{range}</Choice>)}
            </div>
            {errorMessage("horasSemanais")}
          </>
        );

      case "veiculoProprio":
        return (
          <>
            {heading("Qual é sua disponibilidade para essa oportunidade?", "Você possui veículo próprio?")}
            <div className={`${styles.choiceList} ${styles.choiceListBinary} ${errors.veiculoProprio ? styles.groupError : ""}`} aria-invalid={Boolean(errors.veiculoProprio)} tabIndex={-1}>
              {["Sim", "Não"].map((answer) => <Choice checked={q.veiculoProprio === answer} key={answer} name="veiculoProprio" onChange={() => updateQualification("veiculoProprio", answer)} type="radio">{answer}</Choice>)}
            </div>
            {errorMessage("veiculoProprio")}
          </>
        );

      case "possuiNotebook":
        return (
          <>
            {heading("Qual é sua disponibilidade para essa oportunidade?", "Você possui notebook?")}
            <div className={`${styles.choiceList} ${styles.choiceListBinary} ${errors.possuiNotebook ? styles.groupError : ""}`} aria-invalid={Boolean(errors.possuiNotebook)} tabIndex={-1}>
              {["Sim", "Não"].map((answer) => <Choice checked={q.possuiNotebook === answer} key={answer} name="possuiNotebook" onChange={() => updateQualification("possuiNotebook", answer)} type="radio">{answer}</Choice>)}
            </div>
            {errorMessage("possuiNotebook")}
          </>
        );

      case "participaTreinamentos":
        return (
          <>
            {heading("Qual é sua disponibilidade para essa oportunidade?", "Está disposto a participar de treinamentos?")}
            <div className={`${styles.choiceList} ${styles.choiceListBinary} ${errors.participaTreinamentos ? styles.groupError : ""}`} aria-invalid={Boolean(errors.participaTreinamentos)} tabIndex={-1}>
              {["Sim", "Não"].map((answer) => <Choice checked={q.participaTreinamentos === answer} key={answer} name="participaTreinamentos" onChange={() => updateQualification("participaTreinamentos", answer)} type="radio">{answer}</Choice>)}
            </div>
            {errorMessage("participaTreinamentos")}
          </>
        );

      case "rendaAtual":
        return (
          <>
            {heading("Conte-nos sobre seu momento atual", "Qual é sua renda mensal hoje?")}
            <div className={`${styles.choiceList} ${errors.rendaAtual ? styles.groupError : ""}`} aria-invalid={Boolean(errors.rendaAtual)} tabIndex={-1}>
              {INCOME_RANGES.map((range) => <Choice checked={q.rendaAtual === range} key={range} name="rendaAtual" onChange={() => updateQualification("rendaAtual", range)} type="radio">{range}</Choice>)}
            </div>
            {errorMessage("rendaAtual")}
          </>
        );

      case "rendaDesejada12Meses":
        return (
          <>
            {heading("Conte-nos sobre seu momento atual", "Quanto deseja ganhar nos próximos 12 meses?")}
            <label className={`${styles.soloField} ${errors.rendaDesejada12Meses ? styles.fieldError : ""}`}>
              <span className={styles.visuallyHidden}>Renda desejada</span>
              <input aria-invalid={Boolean(errors.rendaDesejada12Meses)} aria-label="Renda desejada nos próximos 12 meses" autoFocus inputMode="numeric" placeholder="R$ 0,00" value={q.rendaDesejada12Meses} onChange={(event) => updateQualification("rendaDesejada12Meses", currencyMask(event.target.value))} />
              <small>Informe uma meta mensal de renda que deseja alcançar nos próximos 12 meses.</small>
              {errorMessage("rendaDesejada12Meses")}
            </label>
          </>
        );

      case "maiorMotivacao":
        return (
          <>
            {heading("O que você busca para sua carreira?", "Qual é sua maior motivação?")}
            <div className={`${styles.choiceList} ${errors.maiorMotivacao ? styles.groupError : ""}`} aria-invalid={Boolean(errors.maiorMotivacao)} tabIndex={-1}>
              {MOTIVATIONS.map((motivation) => <Choice checked={q.maiorMotivacao === motivation} key={motivation} name="maiorMotivacao" onChange={() => updateQualification("maiorMotivacao", motivation)} type="radio">{motivation}</Choice>)}
            </div>
            {errorMessage("maiorMotivacao")}
          </>
        );

      case "habilidadeComercial":
        return (
          <>
            {heading("Como você avalia sua habilidade comercial?", "De 0 a 10, qual nota você dá para sua habilidade comercial?")}
            <div className={`${styles.rating} ${errors.habilidadeComercial ? styles.groupError : ""}`} aria-invalid={Boolean(errors.habilidadeComercial)} tabIndex={-1}>
              {Array.from({ length: 11 }, (_, score) => (
                <button className={q.habilidadeComercial === score ? styles.ratingSelected : ""} key={score} onClick={() => updateQualification("habilidadeComercial", score)} type="button">{score}</button>
              ))}
            </div>
            {errorMessage("habilidadeComercial")}
            <div className={styles.ratingLegend}>
              <span><strong>0:</strong> Ainda preciso desenvolver</span>
              <span><strong>5:</strong> Nível intermediário</span>
              <span><strong>10:</strong> Excelente domínio comercial</span>
            </div>
          </>
        );

      default:
        return (
          <>
            {heading("Revise sua qualificação", "Confira suas respostas antes de enviar. Caso necessário, você pode voltar e editar qualquer etapa.")}
            <div className={styles.reviewGrid}>
              {reviewBlocks.map((block) => (
                <article className={styles.reviewBlock} key={block.title}>
                  <div>
                    <h2>{block.title}</h2>
                    <button onClick={() => {
                      const firstScreen = screens.find((screen) => screen.stage === block.stage);
                      if (!firstScreen) return;
                      setReturnToReviewStage(block.stage);
                      moveTo(firstScreen.key, "backward");
                    }} type="button">Editar</button>
                  </div>
                  {block.lines.map((line, index) => <p key={`${block.title}-${index}`}>{line}</p>)}
                </article>
              ))}
            </div>
            <label className={`${styles.consent} ${errors.consent ? styles.fieldError : ""}`}>
              <input aria-invalid={Boolean(errors.consent)} checked={consent} onChange={(event) => { setConsent(event.target.checked); clearError("consent"); }} type="checkbox" />
              <span aria-hidden="true" />
              <p>Declaro que as informações fornecidas são verdadeiras e autorizo o tratamento dos meus dados para análise do meu perfil profissional, conforme a Política de Privacidade.</p>
            </label>
            {errorMessage("consent")}
            {submitError && <p className={styles.submitError} role="alert">{submitError}</p>}
          </>
        );
    }
  }

  if (submitted) {
    return (
      <main className={styles.page}>
        <section className={styles.confirmation}>
          <span className={styles.successMark} aria-hidden="true">✓</span>
          <h1>Qualificação enviada com sucesso!</h1>
          <p>Recebemos suas informações. Caso seu perfil avance no processo de seleção, a empresa poderá entrar em contato por telefone, WhatsApp ou e-mail.</p>
          <strong>Planeje hoje. Conquiste amanhã.</strong>
          <Link className={styles.primaryButton} href="/">VOLTAR AO INÍCIO <ArrowUpRight /></Link>
        </section>
      </main>
    );
  }

  const isReview = currentKey === "review";
  const canGoBack = currentIndex > 0 || returnToReviewStage !== null;

  return (
    <main className={styles.page}>
      <header className={styles.progressHeader}>
        <div className={styles.progressInfo}>
          <div>
            <strong>Etapa {currentScreen.stage} de 11</strong>
            <span>— {stageMeta.label}</span>
            <small>{stageMeta.progress}%</small>
          </div>
          <div className={styles.progressTrack} aria-label={`${stageMeta.progress}% concluído`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={stageMeta.progress}>
            <span style={{ width: `${stageMeta.progress}%` }} />
          </div>
        </div>
      </header>

      <section className={styles.stageArea}>
        <form className={`${styles.stagePanel} ${direction === "forward" ? styles.slideForward : styles.slideBackward}`} key={currentKey} noValidate onSubmit={isReview ? handleSubmit : handleContinue}>
          <div className={styles.stepBody}>{renderScreen()}</div>
          <div className={styles.actions}>
            <button className={styles.primaryButton} disabled={submitting} type="submit">
              {submitting ? "Enviando..." : isReview ? "ENVIAR MINHA QUALIFICAÇÃO" : currentKey === "habilidadeComercial" ? "REVISAR RESPOSTAS" : "PRÓXIMO"}
              {!submitting && <ArrowUpRight />}
            </button>
          </div>
          <nav className={styles.sideNavigation} aria-label="Navegação do formulário">
            <button aria-label="Voltar para a pergunta anterior" disabled={!canGoBack || submitting} onClick={handleBack} type="button">
              <span aria-hidden="true">↑</span>
            </button>
            <button aria-label={isReview ? "Enviar qualificação" : "Avançar para a próxima pergunta"} disabled={submitting} type="submit">
              <span aria-hidden="true">↓</span>
            </button>
          </nav>
        </form>
      </section>
    </main>
  );
}
