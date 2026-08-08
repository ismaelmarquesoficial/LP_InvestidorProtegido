import MotionEffects from "./MotionEffects";

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type IconName =
  | "listen"
  | "compass"
  | "people"
  | "growth"
  | "message"
  | "target"
  | "shield";

const VisualIcon = ({ name }: { name: IconName }) => {
  const content = {
    listen: <><path d="M3 12s3.2-6 9-6 9 6 9 6-3.2 6-9 6-9-6-9-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    compass: <><circle cx="12" cy="12" r="8.5" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></>,
    people: <><circle cx="9" cy="9" r="3" /><path d="M3.5 19c.6-3 2.5-4.5 5.5-4.5s5 1.5 5.5 4.5M16 7.5a2.7 2.7 0 0 1 0 5.4M16.8 14.5c2.2.3 3.4 1.8 3.7 4.5" /></>,
    growth: <><path d="M4 18V7M4 18h16M7 14l4-4 3 2 5-6" /><path d="M15 6h4v4" /></>,
    message: <><path d="M4 5.5h16v11H9l-5 3v-14Z" /><path d="M8 10h8M8 13h5" /></>,
    target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
    shield: <><path d="M12 3 19 6v5c0 4.7-2.6 8.1-7 10-4.4-1.9-7-5.3-7-10V6l7-3Z" /><path d="m9 12 2 2 4-5" /></>,
  }[name];

  return (
    <svg className="visual-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {content}
    </svg>
  );
};

export default function Home() {
  return (
    <main id="inicio">
      <MotionEffects />
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-scene" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-background-v2.png"
            alt=""
            width="1672"
            height="941"
          />
        </div>

        <div className="hero-ribbons" aria-label="Novidade: oportunidade de alto nível">
          <div className="hero-ribbon hero-ribbon-dark" aria-hidden="true">
            <div className="hero-ribbon-track hero-ribbon-track-reverse">
              {Array.from({ length: 8 }, (_, index) => (
                <span key={index}>Novidade: oportunidade de alto nível <i>✦</i></span>
              ))}
            </div>
          </div>
          <div className="hero-ribbon hero-ribbon-gold" aria-hidden="true">
            <div className="hero-ribbon-track">
              {Array.from({ length: 8 }, (_, index) => (
                <span key={index}>Novidade: oportunidade de alto nível <i>✦</i></span>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-shell section-shell">
          <div className="hero-copy">
            <a className="hero-brand" href="#inicio" aria-label="Investidor Protegido — início">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="brand-logo" src="/logo-investidor-protegido.jpg" alt="Investidor Protegido — Soluções Financeiras" width="752" height="320" />
            </a>
            <h1 id="hero-title">
              Nós buscamos mentalidade de dono. Estamos <span className="hero-title-accent">contratando</span> ambição e talento comercial.
            </h1>
            <p>
              Chega de discurso vazio e metas irreais. Aqui, sua capacidade de
              relacionamento gera faturamento enquanto você ajuda pessoas a construir
              patrimônio.
            </p>
            <a className="primary-cta" href="#candidatura">
              Faça parte <ArrowUpRight />
            </a>
            <div className="hero-proof" aria-label="Mais de 27 anos de experiência no mercado">
              <div className="hero-proof-avatars" aria-hidden="true">
                <span className="hero-proof-avatar hero-proof-avatar-team" />
                <span className="hero-proof-avatar hero-proof-avatar-profile" />
                <span className="hero-proof-avatar hero-proof-avatar-purpose" />
              </div>
              <div className="hero-proof-copy">
                <span className="hero-proof-stars" aria-hidden="true">★★★★★</span>
                <p><strong>+27 anos</strong> de experiência no mercado</p>
              </div>
            </div>
          </div>
        </div>

        <span className="hero-orb hero-orb-one" aria-hidden="true" />
        <span className="hero-orb hero-orb-two" aria-hidden="true" />
      </section>

      <div className="finance-ticker" aria-label="Planejamento, proteção, patrimônio e crescimento">
        <div className="ticker-track" aria-hidden="true">
          {[0, 1].map((group) => (
            <div className="ticker-group" key={group}>
              <span>Planejamento financeiro</span><i>✦</i>
              <span>Proteção</span><i>✦</i>
              <span>Patrimônio</span><i>✦</i>
              <span>Consórcios</span><i>✦</i>
              <span>Crescimento</span><i>✦</i>
            </div>
          ))}
        </div>
      </div>

      <section className="purpose section-shell" id="oportunidade">
        <div className="purpose-copy" data-reveal="left">
          <span className="section-kicker">Carreira com propósito</span>
          <h2>Cresça enquanto ajuda outras pessoas a crescer.</h2>
          <p className="section-lead">
            Aqui, sua atuação vai além de vender uma solução. Você aprende a
            entender objetivos, construir estratégias e acompanhar pessoas na
            formação de um patrimônio mais protegido.
          </p>

          <ul className="benefit-list">
            <li><Check /> Capacitação para atuar com soluções financeiras</li>
            <li><Check /> Portfólio diversificado para diferentes objetivos</li>
            <li><Check /> Ambiente orientado a desenvolvimento e resultado</li>
          </ul>

          <a className="secondary-cta" href="#candidatura">
            Quero participar do processo <ArrowUpRight />
          </a>
        </div>

        <div className="purpose-panel" aria-label="Visão da oportunidade" data-reveal="right">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="purpose-panel-photo" src="/photo-proposito.webp" alt="Consultora financeira orientando um casal em uma reunião de planejamento" width="972" height="1619" />
          <div className="purpose-panel-shade" aria-hidden="true" />
          <div className="panel-orbit" aria-hidden="true">
            <span className="orbit-dot dot-one" />
            <span className="orbit-dot dot-two" />
            <span className="orbit-dot dot-three" />
          </div>
          <div className="purpose-panel-content">
            <p>Uma carreira construída sobre</p>
            <strong>Conhecimento</strong>
            <strong>Relacionamento</strong>
            <strong>Performance</strong>
            <svg className="panel-chart" aria-hidden="true" viewBox="0 0 420 92" fill="none">
              <path className="chart-grid" d="M0 78H420M0 48H420M0 18H420" />
              <path className="chart-line" d="M2 76C45 72 50 58 88 61s52 7 84-9 48-7 76-25 57 4 88-11 48-13 82-14" />
              <circle cx="172" cy="52" r="4" /><circle cx="336" cy="16" r="4" /><circle cx="418" cy="2" r="4" />
            </svg>
            <div className="panel-note">
              <span>01</span>
              <p>Você não precisa saber tudo para começar. Precisa estar pronto para aprender.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="role-section" aria-labelledby="role-title">
        <div className="section-shell">
          <div className="role-heading" data-reveal="up">
            <span className="section-kicker">O que você vai construir</span>
            <h2 id="role-title">Uma trajetória que gera valor dos dois lados.</h2>
            <p>
              Sua rotina combina relacionamento, visão de negócio e aprendizado
              constante para conectar cada cliente à solução mais adequada.
            </p>
          </div>

          <figure className="role-photo" data-reveal="zoom">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photo-equipe.webp" alt="Equipe de profissionais financeiros colaborando em uma reunião" width="1672" height="941" />
            <figcaption aria-hidden="true">
              <span>Escutar</span><i>✦</i><span>Planejar</span><i>✦</i><span>Acompanhar</span>
            </figcaption>
          </figure>

          <div className="role-stage">
            <div className="role-stage-heading" aria-hidden="true">
              <span />
              <p>Da escuta à evolução</p>
            </div>

            <div className="role-grid">
              {[
                ["01", "Entender", "objetivos", "Ouvir o contexto e as prioridades antes de apresentar qualquer caminho.", "listen"],
                ["02", "Orientar", "escolhas", "Traduzir soluções financeiras em decisões claras, responsáveis e personalizadas.", "compass"],
                ["03", "Acompanhar", "trajetórias", "Cultivar confiança e acompanhar a evolução de cada cliente no longo prazo.", "people"],
                ["04", "Evoluir", "sempre", "Ampliar o repertório comercial e financeiro com capacitação contínua.", "growth"],
              ].map(([number, title, complement, description, icon], index) => (
                <article className={`role-card reveal-delay-${index + 1}`} key={number} data-reveal="up">
                  <span className="role-card-number">{number}</span>
                  <div className="role-icon"><VisualIcon name={icon as IconName} /></div>
                  <h3><strong>{title}</strong> {complement}</h3>
                  <p>{description}</p>
                  <span className="role-card-accent" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="profile-section" id="perfil" aria-labelledby="profile-title">
        <div className="section-shell profile-layout">
          <div className="profile-heading" data-reveal="left">
            <span className="section-kicker light">O perfil que buscamos</span>
            <h2 id="profile-title">Talento comercial. Mentalidade de dono. Vontade de aprender.</h2>
            <p>
              Experiência no setor financeiro é bem-vinda, mas não é o único
              caminho. Valorizamos postura, comunicação e disposição para evoluir.
            </p>
            <a className="primary-cta" href="#candidatura">Esse perfil é o meu <ArrowUpRight /></a>
            <figure className="profile-photo" data-reveal="up">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photo-perfil.webp" alt="Profissionais comerciais caminhando em um escritório contemporâneo" width="1448" height="1086" />
              <figcaption><span>Ambição</span> com responsabilidade.</figcaption>
            </figure>
          </div>

          <div className="profile-list" data-reveal="right">
            {[
              ["Comunicação", "Transforma assuntos complexos em conversas simples e objetivas.", "message"],
              ["Relacionamento", "Cria confiança, escuta com atenção e mantém presença no pós-atendimento.", "people"],
              ["Ambição saudável", "Gosta de metas, acompanha resultados e busca novos patamares.", "target"],
              ["Responsabilidade", "Entende que decisões financeiras exigem cuidado, ética e transparência.", "shield"],
            ].map(([title, description, icon], index) => (
              <article className="profile-item" key={title}>
                <span className="profile-icon"><VisualIcon name={icon as IconName} /><small>{String(index + 1).padStart(2, "0")}</small></span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section section-shell" aria-labelledby="faq-title">
        <div className="faq-heading" data-reveal="left">
          <span className="section-kicker">Dúvidas frequentes</span>
          <h2 id="faq-title">Antes de se candidatar.</h2>
        </div>
        <div className="faq-list" data-reveal="right">
          {[
            ["Preciso ter experiência no mercado financeiro?", "Não necessariamente. Experiência comercial ou no setor financeiro pode ajudar, mas postura, comunicação e vontade de aprender também fazem parte da análise."],
            ["Em quais cidades existem oportunidades?", "A Investidor Protegido possui presença em Brasília, Goiânia e Belo Horizonte. A disponibilidade por localidade é confirmada durante o contato com os perfis selecionados."],
            ["Como funciona o processo de seleção?", "Após o envio, o perfil passa por uma análise. Os candidatos com maior alinhamento recebem contato para uma conversa e orientações sobre as próximas etapas."],
            ["Quais soluções fazem parte da atuação?", "O portfólio da empresa inclui planejamento financeiro, consórcios, seguros, previdência, crédito e investimentos, entre outras soluções."],
            ["Quando receberei um retorno?", "O contato acontece de acordo com a análise e a demanda de cada oportunidade. Por isso, é importante preencher todos os dados corretamente."],
          ].map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<i aria-hidden="true">+</i></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="application-section" id="candidatura" aria-labelledby="application-title">
        <div className="section-shell application-layout">
          <div className="application-copy" data-reveal="left">
            <span className="section-kicker light">Dê o primeiro passo</span>
            <h2 id="application-title">Seu novo ambiente pode começar aqui.</h2>
            <p>
              Leva poucos minutos. Preencha com atenção para que nossa equipe
              conheça melhor seu momento, sua experiência e seus objetivos.
            </p>
            <div className="application-assurance">
              <strong>Processo simples</strong>
              <span>3 etapas curtas</span>
              <strong>Análise humana</strong>
              <span>Cada perfil é avaliado</span>
            </div>
            <a className="primary-cta application-cta" href="/formulario">
              Preencher formulário <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="section-shell footer-grid">
          <a className="brand footer-brand" href="#inicio" aria-label="Investidor Protegido — voltar ao início">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-logo footer-logo" src="/logo-investidor-protegido.jpg" alt="Investidor Protegido — Soluções Financeiras" width="752" height="320" />
          </a>
          <p>Protegendo famílias e construindo um legado.</p>
          <div className="footer-locations">
            <span>Brasília</span><span>Goiânia</span><span>Belo Horizonte</span>
          </div>
          <a href="https://investidorprotegido.com.br/" target="_blank" rel="noreferrer">Site institucional ↗</a>
        </div>
        <div className="section-shell footer-bottom">
          <span>© 2026 Investidor Protegido</span>
          <span>@investidorprotegido</span>
        </div>
      </footer>
    </main>
  );
}
