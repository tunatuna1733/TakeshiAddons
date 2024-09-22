import HTTPServer from '../../ServerUtilities';
import { mobs } from '../data/bestiary_data';
import { bestiaryData } from './data';

const server = new HTTPServer();
const port = 8085;

server.get('/staticmobdata', (req, res) => {
  const mobData = {
    data: mobs,
  };
  res.status(200).send(JSON.stringify(mobData));
});

server.get('/bestiary', (req, res) => {
  const htmlContent = FileLib.read(
    './config/ChatTriggers/modules/TakeshiAddons/static/bestiary.html'
  );
  res
    .status(200)
    .header('Content-Type', 'text/html; charset=UTF-8')
    .send(htmlContent);
});

server.get('/bestiarydata', (req, res) => {
  res
    .status(200)
    .header('Content-Type', 'application/json')
    .send(JSON.stringify(bestiaryData));
});

server.post('/bestiarydata', (req, res) => {
  try {
    const body = JSON.parse(req.body);
    bestiaryData.data = body.data;
    bestiaryData.save();
    res.status(200).send('');
  } catch (e) {
    res.status(400).send(e.toString());
  }
});

server.listen(port);
