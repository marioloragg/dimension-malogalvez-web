#!/usr/bin/env python3
"""Genera la Ficha Interna — Lectura Morfológica en PDF a partir de ficha.html.

Uso:
    python3 build.py

Requiere: pip install weasyprint --break-system-packages
Escribe el PDF en ../output/Dimension_Ficha_INTERNA_Lectura_Morfologica.pdf
"""
import os
from weasyprint import HTML

AQUI = os.path.dirname(os.path.abspath(__file__))
SALIDA = os.path.join(AQUI, "..", "output")
os.makedirs(SALIDA, exist_ok=True)

destino = os.path.join(SALIDA, "Dimension_Ficha_INTERNA_Lectura_Morfologica.pdf")
HTML(os.path.join(AQUI, "ficha.html"), base_url=AQUI).write_pdf(destino)
print("Generado:", destino)
