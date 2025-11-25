import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setInputMessage(`Analisar arquivo: ${file.name}`);
    }
  };

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !selectedFile) || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage || `Analisar arquivo: ${selectedFile?.name}`,
      timestamp: new Date().toLocaleTimeString(),
      file: selectedFile
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        response = await axios.post('/api/analyze_data', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        let aiResponse = '';
        if (response.data.status === 'success') {
          if (response.data.outliers_detected !== undefined) {
            aiResponse = `✅ Análise concluída! \n\n📊 **Resultados:**\n- Outliers detectados: ${response.data.outliers_detected}\n- Arquivo processado: ${response.data.cleaned_file}\n\n💾 **Arquivo salvo:** ${response.data.cleaned_file}\n\nA IA Isolation Forest analisou seus dados e identificou valores discrepantes.`;
          } else if (response.data.numbers_extracted !== undefined) {
            aiResponse = `✅ Análise de imagem concluída! \n\n🖼️ **Resultados:**\n- Números extraídos: ${response.data.numbers_extracted}\n- Arquivo gerado: ${response.data.extracted_file}\n\n💾 **Arquivo salvo:** ${response.data.extracted_file}\n\nA IA EasyOCR extraiu dados numéricos da sua imagem.`;
          }
        } else {
          aiResponse = `❌ Erro na análise: ${response.data.error}`;
        }

        const aiMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: aiResponse,
          timestamp: new Date().toLocaleTimeString(),
          downloadUrl: response.data.cleaned_file || response.data.extracted_file
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: '👋 Olá! Sou seu assistente de análise de dados. \n\n**Como posso ajudar:**\n- 📊 Analisar planilhas (CSV/Excel) para detectar outliers\n- 🖼️ Extrair dados numéricos de imagens\n\n**Instruções:**\n1. Clique no botão "📎" para selecionar um arquivo\n2. Envie para análise automática\n3. Receba insights e baixe os resultados',
          timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `❌ Erro de comunicação: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const AboutModal = () => (
    <div className="modal-overlay" onClick={() => setShowAbout(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
    <div className="modal-header">
    <h3>🤖 Sobre o IA Data Analyzer</h3>
    <button className="close-button" onClick={() => setShowAbout(false)}>×</button>
    </div>
    <div className="modal-body">
    <div className="about-section">
    <h4>📋 Descrição do Trabalho</h4>
    <p><strong>Disciplina:</strong> Sistemas Distribuídos - GCC129</p>
    <p><strong>Instituição:</strong> Universidade Federal de Lavras (UFLA)</p>
    <p><strong>Semestre:</strong> 2025/2</p>
    </div>

    <div className="about-section">
    <h4>🎯 Objetivo</h4>
    <p>Desenvolver um sistema distribuído utilizando múltiplos agentes de Inteligência Artificial para resolver problemas de análise de dados automatizada.</p>
    </div>

    <div className="about-section">
    <h4>🤖 Agentes de IA Implementados</h4>
    <ul>
    <li><strong>Spreadsheet Agent:</strong> Isolation Forest para detecção de outliers</li>
    <li><strong>Image Agent:</strong> EasyOCR para extração de dados de imagens</li>
    <li><strong>MCP Orchestrator:</strong> Roteamento inteligente entre agentes</li>
    </ul>
    </div>

    <div className="about-section">
    <h4>🛠️ Tecnologias</h4>
    <div className="tech-stack">
    <span className="tech-tag">FastAPI</span>
    <span className="tech-tag">Docker</span>
    <span className="tech-tag">React</span>
    <span className="tech-tag">MCP</span>
    <span className="tech-tag">scikit-learn</span>
    <span className="tech-tag">EasyOCR</span>
    </div>
    </div>

    <div className="about-section">
    <h4>📁 Funcionalidades</h4>
    <ul>
    <li>✅ Análise automatizada de planilhas</li>
    <li>✅ Extração de dados de imagens</li>
    <li>✅ Comunicação distribuída via MCP</li>
    <li>✅ Interface web moderna</li>
    <li>✅ Containerização com Docker</li>
    <li>✅ Download de resultados</li>
    </ul>
    </div>
    </div>
    </div>
    </div>
  );

  return (
    <div className="app">
    {showAbout && <AboutModal />}

    <div className="sidebar">
    <div className="sidebar-header">
    <h2>🤖 IA Analyzer</h2>
    <p>Sistema Distribuído</p>
    </div>
    <div className="sidebar-menu">
    <button className="menu-item active">
    💬 Nova Análise
    </button>
    <button
    className="menu-item"
    onClick={() => setShowAbout(true)}
    >
    ℹ️ Sobre
    </button>
    </div>
    </div>

    <div className="main-content">
    <div className="chat-header">
    <h3>Análise de Dados com IA</h3>
    <p>Envie arquivos para análise distribuída</p>
    </div>

    <div className="chat-messages">
    {messages.length === 0 && (
      <div className="welcome-message">
      <div className="welcome-icon">🤖</div>
      <h3>Bem-vindo ao IA Data Analyzer</h3>
      <p>Envie planilhas ou imagens para análise com nossas IAs especializadas</p>
      <div className="features">
      <div className="feature">
      <span>📊</span>
      <div>
      <strong>Análise de Planilhas</strong>
      <p>Detecta outliers automaticamente</p>
      </div>
      </div>
      <div className="feature">
      <span>🖼️</span>
      <div>
      <strong>OCR em Imagens</strong>
      <p>Extrai dados numéricos de gráficos</p>
      </div>
      </div>
      <div className="feature">
      <span>🔗</span>
      <div>
      <strong>Sistema Distribuído</strong>
      <p>Múltiplas IAs trabalhando em conjunto</p>
      </div>
      </div>
      </div>
      </div>
    )}

    {messages.map(message => (
      <div key={message.id} className={`message ${message.type}`}>
      <div className="message-avatar">
      {message.type === 'user' ? '👤' : '🤖'}
      </div>
      <div className="message-content">
      <div className="message-text">
      {message.content.split('\n').map((line, i) => (
        <p key={i}>{line}</p>
      ))}
      </div>
      {message.downloadUrl && (
        <div className="download-section">
        <a
        href={`/api/download/${message.downloadUrl}`}
        className="download-button"
        target="_blank"
        rel="noopener noreferrer"
        >
        📥 Baixar Resultado
        </a>
        </div>
      )}
      <div className="message-time">{message.timestamp}</div>
      </div>
      </div>
    ))}

    {isLoading && (
      <div className="message assistant">
      <div className="message-avatar">🤖</div>
      <div className="message-content">
      <div className="loading-dots">
      <span></span>
      <span></span>
      <span></span>
      </div>
      </div>
      </div>
    )}
    <div ref={messagesEndRef} />
    </div>

    <div className="chat-input-container">
    <div className="file-actions">
    <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileSelect}
    accept=".csv,.xlsx,.jpg,.jpeg,.png"
    style={{ display: 'none' }}
    />
    <button
    className="file-button"
    onClick={() => fileInputRef.current?.click()}
    title="Anexar arquivo"
    >
    📎
    </button>
    {selectedFile && (
      <div className="file-info">
      📄 {selectedFile.name}
      </div>
    )}
    </div>

    <div className="input-wrapper">
    <textarea
    value={inputMessage}
    onChange={(e) => setInputMessage(e.target.value)}
    onKeyPress={handleKeyPress}
    placeholder="Digite uma mensagem ou selecione um arquivo para análise..."
    rows="1"
    />
    <button
    onClick={handleSendMessage}
    disabled={isLoading || (!inputMessage.trim() && !selectedFile)}
    className="send-button"
    >
    {isLoading ? '⏳' : '🚀'}
    </button>
    </div>
    </div>
    </div>
    </div>
  );
};

export default App;
