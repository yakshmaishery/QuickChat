import type { PageServerLoad,Actions } from './$types';

export const load: PageServerLoad = async ({ params,cookies }) => {
	let LoginID = cookies.get("LoginID")
	// if(!LoginID){
	// 	return redirect(303,"/")
	// }
	return {
		LoginID:cookies.get("LoginID")
	};
};
