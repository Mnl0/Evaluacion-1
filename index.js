import express from 'express'

const app = express();
const PORT = 3000;

//ok
app.get('/api', (req, res) => {
	res.status(200).setHeader('Content-Type', 'text/plain').send('Hello World!')
	//si aparece un 304 es porque los archivos los esta cargando desde la cache no es un error indica que los datos almacenados en memoria del navegador estan ok y puede seguir utilizandolos
	//se puede enviar el por separado los res.status/ header y send siempre y cuando el ultimo sea el metodo send
})



app.listen(PORT, () => {
	console.log(`Escuchando en el puerto ${PORT}`)
})

