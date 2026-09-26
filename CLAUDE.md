# Salvavidas del servidor

Vigilante que vive FUERA del VPS de Claude Movil (212.227.168.72), en GitHub Actions: cada 5 min mira si https://code.prevencion.cc responde y, si falla 3 veces seguidas, reinicia el VPS por la API del Cloud Panel de IONOS. No confundir con el watchdog/earlyoom que corre DENTRO del VPS (`/home/claudemovil/watchdog-vps.sh`).

## Leer primero
- `.github/workflows/salvavidas.yml`: todo el funcionamiento esta explicado en su cabecera.
- `README.md`: como reiniciar a mano desde el movil.
- Memoria de Pedro: `salvavidas-servidor` y `reset-vps-y-watchdog`.

## Reglas
- El repo es PUBLICO: nunca meter aqui claves ni el id del servidor. `IONOS_TOKEN` y `SERVIDOR_ID` van solo en Settings -> Secrets -> Actions.
- Nunca dos reinicios automaticos en menos de 2 horas (`ultimo-reinicio.txt`): si tras reiniciar sigue caido, no es un cuelgue.
- Al reiniciar, el trabajo falla A PROPOSITO para que GitHub mande el correo. No "arreglarlo".
- No quitar el latido semanal: GitHub apaga los cron de repos sin movimiento en 60 dias.
- El propio workflow hace commits (`latido.txt`, `ultimo-reinicio.txt`): hacer `git pull` antes de tocar nada.
