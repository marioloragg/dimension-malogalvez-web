#!/usr/bin/env python3
"""Regenera los pesos estáticos de Cinzel e Inter usados en la Ficha Interna (PDF).

Descarga las variable fonts oficiales de Google Fonts e instancia los pesos
estáticos que necesita el sistema de diseño Dimension. Solo hace falta
ejecutarlo si estos .ttf se pierden o hay que actualizar de versión — los
estáticos ya están commiteados en este directorio.

Requisitos: pip install fonttools --break-system-packages
"""
import urllib.request
from fontTools import ttLib
from fontTools.varLib import instancer

FUENTES_ORIGEN = {
    "Cinzel-VF.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/cinzel/Cinzel%5Bwght%5D.ttf",
    "Inter-VF.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf",
    "Inter-Italic-VF.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter-Italic%5Bopsz%2Cwght%5D.ttf",
}

INSTANCIAS = [
    ("Cinzel-VF.ttf", {"wght": 400}, "Cinzel-Regular.ttf", "Cinzel", "Regular"),
    ("Cinzel-VF.ttf", {"wght": 600}, "Cinzel-SemiBold.ttf", "Cinzel SemiBold", "Regular"),
    ("Cinzel-VF.ttf", {"wght": 700}, "Cinzel-Bold.ttf", "Cinzel", "Bold"),
    ("Inter-VF.ttf", {"wght": 400, "opsz": 14}, "Inter-Regular.ttf", "Inter", "Regular"),
    ("Inter-VF.ttf", {"wght": 500, "opsz": 14}, "Inter-Medium.ttf", "Inter Medium", "Regular"),
    ("Inter-VF.ttf", {"wght": 600, "opsz": 14}, "Inter-SemiBold.ttf", "Inter SemiBold", "Regular"),
    ("Inter-VF.ttf", {"wght": 700, "opsz": 14}, "Inter-Bold.ttf", "Inter", "Bold"),
    ("Inter-Italic-VF.ttf", {"wght": 400, "opsz": 14}, "Inter-Italic.ttf", "Inter Italic", "Regular"),
]


def main():
    for nombre, url in FUENTES_ORIGEN.items():
        print("Descargando", nombre)
        urllib.request.urlretrieve(url, nombre)

    for src, ejes, salida, familia, subfamilia in INSTANCIAS:
        f = ttLib.TTFont(src)
        instancer.instantiateVariableFont(f, ejes, inplace=True)
        name = f["name"]
        valores = [
            (1, familia),
            (2, subfamilia),
            (4, f"{familia} {subfamilia}".strip()),
            (6, f"{familia}-{subfamilia}".replace(" ", "")),
            (16, familia),
            (17, subfamilia),
        ]
        for nid, val in valores:
            name.setName(val, nid, 3, 1, 0x409)
            name.setName(val, nid, 1, 0, 0)
        f.save(salida)
        print("Escrito", salida)

    for nombre in FUENTES_ORIGEN:
        import os
        os.remove(nombre)


if __name__ == "__main__":
    main()
