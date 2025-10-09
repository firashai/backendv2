import bootstrap from '../src/main';

export default async function handler(req: any, res: any) {
  const app = await bootstrap;
  return app(req, res);
}
