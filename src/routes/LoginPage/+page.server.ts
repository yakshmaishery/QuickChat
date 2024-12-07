import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
   LoginActionMethos: async (event) => {
      const data = await event.request.formData();
      let Email = data.get("email")
      // let password = data.get("password")
      if(Email){
         event.cookies.set("LoginID",Email.toString(),{path:"/",httpOnly:true})
      }
      return redirect(300,"/UserDashboard")
   }
} satisfies Actions;