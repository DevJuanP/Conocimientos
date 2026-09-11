---
title: Itsfree.ai - APIs de IA gratis
area: desarrollo
tags: [desarrollo, desarrollo/ia]
created: 2026-09-11
updated: 2026-09-11
related: ["../buenas-practicas/refero-styles-design-md.md"]
---

# Itsfree.ai - APIs de IA gratis

Directorio abierto de midu.dev con todas las formas de usar un modelo de IA sin pagar: 463 modelos gratis, 25 proveedores con free tier y 9 runtimes locales. Verificado el 2026-09-02 segun la propia web.

Ojo con el nombre: `itsfee.ai` no existe (no resuelve DNS). El sitio real es `itsfree.ai`, hermano de `itsfree.dev` (herramientas dev con capa gratuita).

## Que contiene

* **Free APIs:** hardware ajeno sin costo, ordenadas por cuanto dejan usar. Cada ficha trae limite, ventana de contexto, base URL, que registro pide y enlace a la doc oficial.
* **Run it on your own machine:** runtimes locales sin cuota, sin key y sin que nada salga del laptop.
* **Around the models:** tooling que no es un modelo (editores, playgrounds, comparadores, benchmarks).
* Filtros: `all`, `api`, `runtimes`, `chat & playground`, `coding agents`, `tools`, `no card`, `no sign-up`, `openai-compatible`, `highlights`.

Casi todo es **OpenAI-compatible**: acepta la misma forma de request que el SDK de OpenAI, solo cambian base URL y key.

## Proveedores destacados con free tier

| Proveedor | Gratis | Contexto | Registro |
|---|---|---|---|
| Google AI Studio | 1500 req/dia, 17 modelos Gemini | 1M | email, sin tarjeta |
| Groq | 1000 req/dia (GPT-OSS, Qwen) | 131K | email, sin tarjeta |
| NVIDIA NIM | 82 modelos, 40 req/min sin tope diario publicado | 1M | telefono, sin tarjeta |
| Cerebras | 1M tokens/dia | 65K | pide tarjeta por credito inicial de $5 |
| Cloudflare Workers AI | 10000 neurons/dia, 40 modelos | 262K | email, sin tarjeta |
| OpenRouter | 18 modelos a coste 0 | 1M | email, sin tarjeta |
| Mistral AI | modo free + Labs, 12 modelos | 256K | email, sin tarjeta |
| Cohere | 1000 req/mes (Command, Embed, Rerank) | 256K | email, sin tarjeta |
| Hugging Face | $0.10 de creditos/mes, 135 modelos | 131K | email, sin tarjeta |
| LLM7.io | 10 req/min (40 con token) | 1M | sin registro |
| Vercel AI Gateway | $5 de creditos/mes, 12 modelos | 1M | email, sin tarjeta |
| Z.ai (Zhipu) | modelos GLM Flash gratis | 200K | telefono |
| DeepSeek | creditos al registrarse | 1M | email, sin tarjeta |

Los numeros cambian sin aviso: confirmar siempre en `/provider/<nombre>/` y en el pricing oficial antes de depender de un limite.

## Runtimes locales (gratis por definicion)

Si el modelo cabe en la maquina, no hay cuota ni key. Todos exponen endpoint local tipo `localhost:11434/v1`:

* **Ollama:** CLI + servidor, un comando y el modelo corre local.
* **LM Studio:** Ollama con GUI para descubrir, descargar y chatear.
* **llama.cpp:** motor en C++ sin dependencias, base de casi todo lo demas.
* **Jan:** alternativa open source a ChatGPT 100% offline.
* **GPT4All:** chat con documentos locales, nada sale del laptop.
* **vLLM:** servidor de inferencia para produccion con GPU propia.
* **MLX:** framework de Apple, lo mas rapido en Mac con chip M.
* **llamafile:** un solo binario que es modelo + runtime, sin instalacion.
* **KoboldCpp:** ejecutable unico sobre llama.cpp, afinado para texto largo.

Modelos de 7B corren en CPU de laptop comun; la GPU da velocidad, no acceso. Para saber que cabe en tu maquina: `https://canirun.ai`.

## Herramientas alrededor

* **Agentes de codigo:** OpenCode, Cline, Kilo Code, Continue, Aider (apuntan a cualquier API gratis de la lista).
* **Playgrounds:** Google Colab (GPU gratis en navegador), AI Studio Playground, Hugging Face Spaces, LMArena (compara 2 modelos a ciegas).
* **Utilidades:** isbetter.ai (un prompt a todos los modelos a la vez), OpenRouter Rankings, Artificial Analysis (benchmarks), Tiktokenizer (contar tokens antes de gastar cuota).

## Advertencias de la propia web

* **Produccion:** rara vez. Son tiers de evaluacion sin SLA y varios prohiben prod. Prototipa gratis, cotiza el plan pago antes de lanzar.
* **Privacidad:** asume que tus prompts pueden usarse para entrenar salvo que el proveedor diga lo contrario. Google lo dice abiertamente del tier gratis de Gemini. Lo confidencial va a runtime local.
* **Sin GPU:** no hace falta para empezar; CPU alcanza para 7B y Mac recientes rinden bien con MLX.

## Proyecto hermano

`itsfree.dev`: mismo autor, catalogo de herramientas dev con capa gratuita util (hosting, bases de datos, auth, email, observabilidad, CI/CD). La categoria `IA y machine learning` lista 16 recursos con el mismo criterio.

## Enlaces

* Directorio: `https://itsfree.ai/`
* Todos los modelos: `https://itsfree.ai/models/`
* Sin tarjeta: `https://itsfree.ai/free-ai-apis-without-credit-card/`
* Sin registro: `https://itsfree.ai/free-ai-apis-without-signup/`
* OpenAI-compatibles: `https://itsfree.ai/openai-compatible-free-apis/`
* Local: `https://itsfree.ai/run-ai-models-locally/`
* Agentes gratis: `https://itsfree.ai/free-ai-coding-agents/`
* Repo: `https://github.com/midudev/itsfree.ai`
* Hermano dev: `https://itsfree.dev/es`

## Ver también

* [IA (MOC)](_index.md)
* [Refero Styles y DESIGN.md](../buenas-practicas/refero-styles-design-md.md)
