#!/usr/bin/env python3
"""Regenera los pesos estáticos de Outfit usados en ambos documentos.

Descarga la variable font oficial de Google Fonts e instancia los pesos
estáticos que necesita el sistema de diseño Dimension. Solo hace falta
ejecutarlo si estos .ttf se pierden o hay que actualizar de versión — los
estáticos ya están commiteados en este directorio.

Requisitos: pip install fonttools --break-system-packages

Nota: Outfit no tiene variante itálica en Google Fonts — el sistema de
diseño usa peso y color para distinguir texto secundario en vez de itálica.
"""
import os
import urllib.request
from fontTools import ttLib
from fontTools.varLib import instancer

ORIGEN = "https://raw.githubusercontent.com/google/fonts/main/ofl/outfit/Outfit%5Bwght%5D.ttf"
VF = "Outfit-VF.ttf"

INSTANCIAS = [
    ({"wght": 400}, "Outfit-Regular.ttf", "Outfit", "Regular"),
    ({"wght": 500}, "Outfit-Medium.ttf", "Outfit Medium", "Regular"),
    ({"wght": 600}, "Outfit-SemiBold.ttf", "Outfit SemiBold", "Regular"),
    ({"wght": 700}, "Outfit-Bold.ttf", "Outfit", "Bold"),
    ({"wght": 800}, "Outfit-ExtraBold.ttf", "Outfit ExtraBold", "Regular"),
]


def main():
    print("Descargando", VF)
    urllib.request.urlretrieve(ORIGEN, VF)

    for ejes, salida, familia, subfamilia in INSTANCIAS:
        f = ttLib.TTFont(VF)
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

    os.remove(VF)


if __name__ == "__main__":
    main()
