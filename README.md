# 🤖 IA Data Analyzer - Sistema Distribuído

Sistema distribuído com múltiplos agentes de IA para análise automatizada de dados, desenvolvido para a disciplina de Sistemas Distribuídos (GCC129) da UFLA.

## 🎯 Funcionalidades

- **📊 Análise de Planilhas**: Detecção de outliers usando Isolation Forest
- **🖼️ Extração de Dados de Imagens**: OCR com EasyOCR para números em gráficos
- **🔗 Comunicação Distribuída**: MCP (Model Context Protocol) entre agentes
- **💻 Interface Web**: Frontend moderno estilo ChatGPT
- **🐳 Containerização**: Docker para todos os componentes
- **💾 Download de Resultados**: Arquivos processados disponíveis para download

## 🏗️ Arquitetura

### Componentes do Sistema

| Componente        | Tecnologia             | Função                  | Porta |
| ----------------- | ---------------------- | ----------------------- | ----- |
| Frontend          | React + Vite           | Interface do usuário    | 80    |
| MCP Orchestrator  | FastAPI                | Roteamento entre agents | 8000  |
| Spreadsheet Agent | FastAPI + scikit-learn | Análise de planilhas    | 8001  |
| Image Agent       | FastAPI + EasyOCR      | OCR em imagens          | 8002  |

### Fluxo de Dados

Usuário → [Frontend] → [MCP Orchestrator] → [Agente Específico] → [Resultado]

## 🚀 Instalação e Execução

### Pré-requisitos
- Docker
- Docker Compose

### Executar o Sistema
```bash
# Clone o repositório
git clone https://github.com/franfernandex/sistemas-distribuidos.git
cd ia-data-analyzer

# Execute com Docker Compose
docker-compose up --build

# Acesse a aplicação
# http://localhost
```

### Execução sem Docker (Desenvolvimento)

```bash
# Backend
cd mcp_server && pip install -r requirements.txt && python orchestrator.py

# Frontend  
cd frontend && npm install && npm run dev
```



## 📚 Documentação

- [📋 Documentação Arquitetônica](https://docs/arquitetura.md)
- [🔧 Configuração MCP](https://mcp_server/mcp_config.yml)
- [🐳 Docker Compose](https://docker-compose.yml/)

## 🛠️ Tecnologias Utilizadas

### Backend

- **FastAPI**: Framework web moderno
- **scikit-learn**: Machine Learning (Isolation Forest)
- **EasyOCR**: Reconhecimento óptico de caracteres
- **OpenCV**: Processamento de imagens
- **Docker**: Containerização

### Frontend

- **React**: Interface do usuário
- **Vite**: Build tool
- **Axios**: Cliente HTTP
- **CSS3**: Estilos modernos

### Infraestrutura

- **Docker Compose**: Orquestração de containers
- **Nginx**: Servidor web para frontend
- **MCP**: Protocolo de comunicação entre agents

## 🎓 Sobre o Trabalho

### Disciplina

- **Nome**: Sistemas Distribuídos (GCC129)
- **Instituição**: Universidade Federal de Lavras (UFLA)
- **Semestre**: 2025/2

### Requisitos Atendidos

- ✅ Múltiplos agentes de IA (2+)
- ✅ Um modelo local e containerizado
- ✅ Comunicação MCP entre agents
- ✅ Microserviços com APIs
- ✅ Interface web moderna
- ✅ Documentação completa

## 🤝 Desenvolvimento

### Estrutura do Projeto

```text
ia-data-analyzer/
├── frontend/          # Interface React
├── mcp_server/        # Orchestrator MCP
├── agents/           # Agentes de IA
│   ├── spreadsheet_agent/
│   └── image_agent/
├── docs/             # Documentação
└── docker-compose.yml
```



### Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.

------

**Desenvolvido com ❤️ para a disciplina de Sistemas Distribuídos - UFLA 2025/2**

~~~text
## 🚀 **4. IMPLANTAR AS MUDANÇAS**

```bash
# Voltar para a raiz do projeto
cd ~/Downloads/oi/ia-data-analyzer

# Rebuild com as novas funcionalidades
docker-compose down && docker-compose up --build
~~~
