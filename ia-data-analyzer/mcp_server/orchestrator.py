from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse, JSONResponse
import yaml
import requests
import os
from typing import Dict, Any

app = FastAPI(title="MCP Orchestrator")

# Carrega configuração MCP
with open('mcp_config.yml', 'r') as f:
    mcp_config = yaml.safe_load(f)

def route_request(file_extension: str) -> Dict[str, Any]:
    """Roteia requisição baseado no tipo de arquivo usando regras MCP"""
    for rule in mcp_config['routing']['rules']:
        if file_extension in rule['condition']:
            return {
                'agent': rule['target_agent'],
                'action': rule['action'],
                'endpoint': mcp_config['agents'][rule['target_agent']]['endpoint']
            }
    return {'error': 'No suitable agent found'}

@app.post("/analyze_data")
async def analyze_data(file: UploadFile = File(...)):
    """Endpoint principal que orquestra a análise usando MCP"""
    
    file_extension = os.path.splitext(file.filename)[1].lower()
    routing_info = route_request(file_extension)
    
    if 'error' in routing_info:
        return {"error": routing_info['error']}
    
    # Lê o conteúdo do arquivo UMA VEZ
    file_content = await file.read()
    
    # Encaminha para o agente apropriado
    agent_endpoint = routing_info['endpoint']
    action = routing_info['action']
    
    try:
        # Para AMBOS os agents, usa upload de arquivo
        files = {'file': (file.filename, file_content, file.content_type)}
        response = requests.post(
            f"{agent_endpoint}/{action}",
            files=files
        )
        
        return response.json()
    
    except Exception as e:
        return {"error": f"Communication error with {routing_info['agent']}: {str(e)}"}

@app.get("/download/{filename}")
async def download_file(filename: str):
    """Endpoint para download de arquivos processados"""
    file_path = f"/app/shared/{filename}"
    if os.path.exists(file_path):
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type='application/octet-stream'
        )
    return JSONResponse(
        status_code=404,
        content={"error": f"File {filename} not found"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
