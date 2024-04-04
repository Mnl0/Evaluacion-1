import express from 'express'
import path from 'path'
const app = express();
const PORT = 3000;

//ok
app.get('/api', (req, res) => {
	res.status(200).setHeader('Content-Type', 'text/plain').send('Hello World!')
	//si aparece un 304 es porque los archivos los esta cargando desde la cache no es un error indica que los datos almacenados en memoria del navegador estan ok y puede seguir utilizandolos
	//se puede enviar el por separado los res.status/ header y send siempre y cuando el ultimo sea el metodo send
})

const __dirname = path.resolve()
app.use(express.static(__dirname))
//primero definimos la ruta absouta del directorio para no poner el tremendo chorizo en sendFile y como con modulejs no esta definido __dirname usarmos path con el metodo de resolve si no se le pasa un parametro devuelve la ruta absoluta de donde se ejecuta me sirve ya que mi index.html esta en la misma carpeta.

app.get('/api/login', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

app.use(express.json())
app.post('/api/login', (req, res) => {
	console.log(req.body)
})


app.listen(PORT, () => {
	console.log(`Escuchando en el puerto ${PORT}`)
})

