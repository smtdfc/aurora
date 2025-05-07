import { RumiousApp } from 'rumious';
import { RumiousRouterModule } from 'rumious-router';


export function initRouter(app: RumiousApp): RumiousRouterModule {
  const router = app.addModule(RumiousRouterModule, {
    strategy: 'hash',
  });
  
  router.event.on('not_found',()=>{
    console.log('not_found');
  });
  
  router.addRoute('/',(async ()=> (await import('../pages/home.tsx')).Page),[]);
  
  return router;
}