/*% if (feature.D_EmailNotification) { %*/
recipient="mail@mail.example.com"
subject="Realizado despliegue de /*%= data.basicData.name %*/"

body="Se acaba de realizar el despliegue de la aplicación /*%= data.basicData.name %*/ en el entorno de producción.\\n
Puede comprobar su estado en /*%= getExtraConfigFromSpec(data, 'client_deploy_url', 'http://localhost:1234') %*/\\n"
echo "$body" | mailx -a "Content-Type: text/plain; charset=UTF-8" -s "$subject" "$recipient"
/*% } %*/
