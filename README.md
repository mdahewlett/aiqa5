# Fifth Time

## This time around

The main change was to go back through the deployment and straighten out the order of setting up the server. Next time will be much faster!

- [x] Setup FE - vite, tailwindcss, shadcn, lucide, added favicon and tab text, removed template text
- [x] Setup BE - venv, fastapi, uvicorn, openai, dotenv, added get healthcheck and post, cors, .env
- [x] Connected git
- [x] Add FE component
- [x] Add password + rate limiting + llm to BE
- [x] add dockers, docker-compose, nginx
- [x] setup and deploy to VPS
- [x] add HTTPS via certbot & Let's Encrypt
- [ ] Github actions

## Notes

- don't need to memorize FE setup, shadcn installation guide is fast enough
- forgot the path as part of @app.POST("path")
- OpenAI forgot 'content' as end of response, and 'content' as part of message list
- password protect, slowapi rate limiting still slow
- missing $ in FE dockerfile for VITE_API_URL=$VITE_API_URL so was not hitting BE
- added nginx back into dockerfile for dev and prod, separate nginx conf for dev and prod
