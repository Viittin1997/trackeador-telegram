import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/landing-page.css';

const LandingPage = () => {
  const [emailValue, setEmailValue] = useState('');
  const [whatsappValue, setWhatsappValue] = useState('');
  const location = useLocation();

  // Função para formatar o WhatsApp
  const formatWhatsapp = (value) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    const limitedValue = numericValue.slice(0, 11);
    
    // Formata como (XX) XXXXX-XXXX
    if (limitedValue.length <= 2) {
      return limitedValue;
    } else if (limitedValue.length <= 7) {
      return `(${limitedValue.slice(0, 2)}) ${limitedValue.slice(2)}`;
    } else {
      return `(${limitedValue.slice(0, 2)}) ${limitedValue.slice(2, 7)}-${limitedValue.slice(7)}`;
    }
  };

  // Handler para o campo de WhatsApp
  const handleWhatsappChange = (e) => {
    const formattedValue = formatWhatsapp(e.target.value);
    setWhatsappValue(formattedValue);
  };

  useEffect(() => {
    // Carrossel de provas sociais
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.carousel-control.next');
    const prevButton = document.querySelector('.carousel-control.prev');
    const dots = Array.from(document.querySelectorAll('.dot'));
    
    if (track && slides.length && nextButton && prevButton) {
      let currentIndex = 0;
      
      // Função para mover o slide
      const moveToSlide = (index) => {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        track.style.transform = `translateX(-${index * 100}%)`;
        
        // Atualizar dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        currentIndex = index;
      };
      
      // Event listeners para os botões
      nextButton.addEventListener('click', () => {
        moveToSlide(currentIndex + 1);
      });
      
      prevButton.addEventListener('click', () => {
        moveToSlide(currentIndex - 1);
      });
      
      // Event listeners para os dots
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          moveToSlide(index);
        });
      });
    }

    // Capturar parâmetros da URL
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmailValue(emailParam);
    }
  }, [location]);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container">
          <img src="/logotipo-branco.png" alt="TrackPro" className="landing-logo" />
          <div className="header-cta">
            <Link to="/" className="cta-button">Acessar Plataforma</Link>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Aumente suas Conversões no Telegram em até 55%</h1>
            <h2>A plataforma que rastreia entradas no seu canal do Telegram</h2>
            <p>Chega de campanhas sem rastreamento e resultados imprevisíveis. Tenha controle total sobre suas campanhas no Telegram.</p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Precisão nos dados</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">+230</span>
                <span className="stat-label">Links sendo rastreados</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1M+</span>
                <span className="stat-label">Entradas em canais rastreados/mês</span>
              </div>
            </div>
            <Link to="/cadastro-usuarios" className="cta-button large accent">
              Começar Teste Gratuito de 10 Dias <i className="fas fa-arrow-right"></i>
            </Link>
            <p className="no-card-required">Sem necessidade de cartão de crédito para testar</p>
          </div>
          <div className="hero-image">
            <div className="dashboard-preview">
              <img src="/logotipo-normal.png" alt="Dashboard TrackPro" className="dashboard-img" />
              <div className="device-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Ferramentas que Impulsionam suas Vendas</h2>
            <p>Recursos exclusivos para maximizar seus resultados no Telegram</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="feature-tag">Exclusivo</div>
              <h3>Análise Detalhada</h3>
              <p>Métricas completas sobre o desempenho dos seus links e campanhas em tempo real.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="feature-tag">Exclusivo</div>
              <h3>Relatórios Diários</h3>
              <p>Acompanhe o desempenho das suas campanhas com relatórios detalhados por período personalizado.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Responsivo</h3>
              <p>Acesse suas estatísticas de qualquer lugar, em qualquer dispositivo, sem perder dados.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <div className="feature-tag">Exclusivo</div>
              <h3>Pixel de Rastreamento</h3>
              <p>Nosso pixel exclusivo para Telegram garante precisão mesmo em condições adversas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="trusted-by">
        <div className="container">
          <h3>Resultados de quem confia na TrackPro</h3>
          <p className="section-subtitle">Resultados de operações reais, antes e após terem campanhas otimizadas pelo trackeador</p>
          <div className="testimonials-carousel">
            <div className="carousel-container">
              <div className="carousel-track">
                <div className="carousel-slide">
                  <img src="/prova1.jpeg" alt="Prova Social 1" className="proof-image" />
                </div>
                <div className="carousel-slide">
                  <img src="/prova2.jpeg" alt="Prova Social 2" className="proof-image" />
                </div>
                <div className="carousel-slide">
                  <img src="/prova3.jpeg" alt="Prova Social 3" className="proof-image" />
                </div>
                <div className="carousel-slide">
                  <img src="/prova4.jpeg" alt="Prova Social 4" className="proof-image" />
                </div>
              </div>
            </div>
            <div className="carousel-controls">
              <button className="carousel-control prev">
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className="carousel-dots">
                <span className="dot active" data-index="0"></span>
                <span className="dot" data-index="1"></span>
                <span className="dot" data-index="2"></span>
                <span className="dot" data-index="3"></span>
              </div>
              <button className="carousel-control next">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <p>Utilizado por afiliados das principais plataformas do mercado</p>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>Como Funciona</h2>
            <p>Quatro passos simples para otimizar suas campanhas</p>
          </div>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Crie seu link personalizado</h3>
                <p>Crie links personalizados diretamente no seu canal ou grupo do Telegram para rastrear entradas.</p>
              </div>
            </div>
            <div className="step-connector"><i className="fas fa-arrow-right"></i></div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Cadastre na plataforma</h3>
                <p>Registre seu link em nossa plataforma com todas as informações necessárias para análise completa.</p>
              </div>
            </div>
            <div className="step-connector"><i className="fas fa-arrow-right"></i></div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Monitore as entradas</h3>
                <p>Comece a registrar as entradas no grupo através do seu pixel otimizado para máxima precisão.</p>
              </div>
            </div>
            <div className="step-connector"><i className="fas fa-arrow-right"></i></div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Escale seu negócio</h3>
                <p>Obtenha melhores resultados com dados precisos e escale suas campanhas vencedoras.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2>Planos e Preços</h2>
            <p>Escolha o plano ideal para o seu negócio</p>
          </div>
          
          <div className="free-trial-banner">
            <div className="free-trial-content">
              <h3><i className="fas fa-gift"></i> Comece Grátis</h3>
              <p>Experimente nosso sistema por 10 dias sem compromisso</p>
            </div>
            <Link to="/cadastro-usuarios" className="cta-button accent">Iniciar Teste Gratuito</Link>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Master</h3>
                <div className="price">
                  <span className="currency">R$</span>
                  <span className="amount">347</span>
                  <span className="period">/mês</span>
                </div>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> Até 5 links ativos</li>
                  <li><i className="fas fa-check"></i> Dashboard</li>
                  <li><i className="fas fa-check"></i> Relatórios</li>
                  <li><i className="fas fa-check"></i> 1 usuário</li>
                  <li><i className="fas fa-check"></i> Suporte via Whatsapp</li>
                </ul>
              </div>
              <div className="pricing-footer">
                <Link to="/cadastro-usuarios" className="pricing-button">Começar Teste de 10 Dias</Link>
              </div>
            </div>
            
            <div className="pricing-card featured">
              <div className="popular-tag">Premium</div>
              <div className="best-value">Melhor Custo-Benefício</div>
              <div className="pricing-header">
                <h3>Profissional</h3>
                <div className="price">
                  <span className="currency">R$</span>
                  <span className="amount">697</span>
                  <span className="period">/mês</span>
                </div>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> <strong>Até 15 links ativos</strong></li>
                  <li><i className="fas fa-check"></i> <strong>Dashboard</strong></li>
                  <li><i className="fas fa-check"></i> <strong>Relatórios</strong></li>
                  <li><i className="fas fa-check"></i> <strong>3 usuários</strong></li>
                  <li><i className="fas fa-check"></i> <strong>Suporte prioritário via Whatsapp</strong></li>
                  <li><i className="fas fa-check"></i> <strong>5 landing pages premium's</strong></li>
                </ul>
              </div>
              <div className="pricing-footer">
                <Link to="/cadastro-usuarios" className="pricing-button featured">Começar Teste de 10 Dias</Link>
                <div className="guarantee">
                  <i className="fas fa-shield-alt"></i> Garantia de 30 dias ou seu dinheiro de volta
                </div>
              </div>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Empresarial</h3>
                <div className="price">
                  <span className="amount">Personalizado</span>
                </div>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> Links ilimitados</li>
                  <li><i className="fas fa-check"></i> Dashboard personalizado</li>
                  <li><i className="fas fa-check"></i> Relatórios em tempo real</li>
                  <li><i className="fas fa-check"></i> Usuários ilimitados</li>
                  <li><i className="fas fa-check"></i> Suporte 24/7 via Whatsapp</li>
                  <li><i className="fas fa-check"></i> Templates de LandingPage's premium's</li>
                  <li><i className="fas fa-check"></i> Treinamento exclusivo</li>
                </ul>
              </div>
              <div className="pricing-footer">
                <Link to="/cadastro-usuarios" className="pricing-button">Começar Teste de 10 Dias</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>O que nossos clientes dizem</h2>
            <p>Histórias de sucesso com o TrackPro</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p>"O TrackPro revolucionou nossa forma de gerenciar campanhas no Telegram. Conseguimos <strong>aumentar nossa taxa de conversão em 45% em apenas 2 meses</strong>. A precisão dos dados é impressionante."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Marcelo Rodrigues</h4>
                  <p><strong>Gestor de tráfego</strong>, Bravobet</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p>"A facilidade de uso e a precisão dos dados são impressionantes. Finalmente temos <strong>visibilidade completa sobre o desempenho das nossas campanhas</strong> e conseguimos otimizar nosso ROI em 35%."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Matheus Oliveira</h4>
                  <p><strong>Produtor</strong>, Info-produtos em geral</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <p>"Como afiliado, eu precisava de uma ferramenta que me desse insights reais sobre minhas campanhas no Telegram. O TrackPro me ajudou a <strong>identificar quais estratégias realmente funcionam</strong> e a escalar meus resultados."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Rafael Mendes</h4>
                  <p><strong>Afiliado Elite</strong>, InfoProducts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2>Perguntas Frequentes</h2>
            <p>Tudo o que você precisa saber sobre o TrackPro</p>
          </div>
          <div className="faq-grid">
            <div className="faq-item">
              <h3><i className="fas fa-question-circle"></i> Posso testar antes de assinar?</h3>
              <p>Sim! Oferecemos um período de teste gratuito de 10 dias para todos os planos, sem necessidade de cartão de crédito. Você terá acesso a todas as funcionalidades do plano escolhido.</p>
            </div>
            <div className="faq-item">
              <h3><i className="fas fa-question-circle"></i> Quanto tempo leva para implementar o TrackPro?</h3>
              <p>A implementação é imediata! Após o cadastro, você já pode começar a criar seus links personalizados e compartilhá-los no Telegram. Todo o processo leva menos de 5 minutos para quem já possui a LandingPage.</p>
            </div>
            <div className="faq-item">
              <h3><i className="fas fa-question-circle"></i> Posso cancelar minha assinatura a qualquer momento?</h3>
              <p>Sim, você pode cancelar sua assinatura a qualquer momento sem taxas ou multas. Se cancelar dentro do período de garantia de 30 dias, você receberá reembolso integral.</p>
            </div>
            <div className="faq-item">
              <h3><i className="fas fa-question-circle"></i> Como o TrackPro se compara a outras ferramentas?</h3>
              <p>O TrackPro foi desenvolvido especificamente para o Telegram, oferecendo precisão superior a 99,9% mesmo em condições adversas. Diferente de outras ferramentas genéricas, nosso foco é maximizar seus resultados nesta plataforma.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Pronto para transformar seus dados em resultados?</h2>
          <p>Comece a usar o TrackPro hoje mesmo e leve suas campanhas no Telegram para o próximo nível.</p>
          
          <div className="cta-split">
            <div className="cta-form">
              <h3>Comece seu teste gratuito agora</h3>
              <form className="signup-form" action="/cadastro-usuarios" method="get">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Seu melhor e-mail" 
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  required 
                />
                <input 
                  type="tel" 
                  name="whatsapp" 
                  placeholder="Seu WhatsApp com DDD" 
                  value={whatsappValue}
                  onChange={handleWhatsappChange}
                  maxLength={16} // (XX) XXXXX-XXXX tem 16 caracteres
                  required 
                />
                <button type="submit" className="cta-button large accent">
                  Começar Gratuitamente <i className="fas fa-arrow-right"></i>
                </button>
              </form>
              <p className="cta-subtext">Não é necessário cartão de crédito • Teste gratuito por 10 dias</p>
            </div>
            
            <div className="cta-benefits">
              <div className="benefit-item">
                <i className="fas fa-check-circle"></i>
                <span>Aumento médio de 35% no ROI</span>
              </div>
              <div className="benefit-item">
                <i className="fas fa-check-circle"></i>
                <span>Implementação em menos de 5 minutos</span>
              </div>
              <div className="benefit-item">
                <i className="fas fa-check-circle"></i>
                <span>Suporte técnico especializado</span>
              </div>
              <div className="benefit-item">
                <i className="fas fa-check-circle"></i>
                <span>Garantia de satisfação de 30 dias</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-badges">
        <div className="container">
          <div className="badges-container">
            <div className="badge-item">
              <i className="fas fa-lock"></i>
              <span>Dados Seguros</span>
            </div>
            <div className="badge-item">
              <i className="fas fa-shield-alt"></i>
              <span>SSL Certificado</span>
            </div>
            <div className="badge-item">
              <i className="fas fa-credit-card"></i>
              <span>Pagamento Seguro</span>
            </div>
            <div className="badge-item">
              <i className="fas fa-headset"></i>
              <span>Suporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-logo">
              <img src="/logotipo-branco.png" alt="TrackPro" />
              <p>Dados precisos, decisões inteligentes</p>
              <div className="social-icons">
                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Produto</h4>
                <ul>
                  <li><a href="#features">Recursos</a></li>
                  <li><a href="#pricing">Preços</a></li>
                  <li><a href="#faq">FAQ</a></li>
                  <li><a href="#demo">Demonstração</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Empresa</h4>
                <ul>
                  <li><a href="#about">Sobre nós</a></li>
                  <li><a href="#contact">Contato</a></li>
                  <li><a href="#blog">Blog</a></li>
                  <li><a href="#careers">Carreiras</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#terms">Termos de Uso</a></li>
                  <li><a href="#privacy">Privacidade</a></li>
                  <li><a href="#cookies">Cookies</a></li>
                  <li><a href="#gdpr">LGPD</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Atendimento</h4>
                <ul>
                  <li><i className="fas fa-envelope"></i> suporte@trackpro.com.br</li>
                  <li><i className="fas fa-phone"></i> (11) 3456-7890</li>
                  <li><i className="fas fa-clock"></i> Seg-Sex: 9h às 18h</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} TrackPro. Todos os direitos reservados.</p>
            <div className="payment-methods">
              <span>Métodos de pagamento:</span>
              <i className="fab fa-cc-visa"></i>
              <i className="fab fa-cc-mastercard"></i>
              <i className="fab fa-cc-amex"></i>
              <i className="fab fa-pix"></i>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
