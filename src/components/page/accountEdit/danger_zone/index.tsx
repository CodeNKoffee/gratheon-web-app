import Button from "@/components/shared/button";
import { logout } from "@/components/user";
import styles from "./style.less"
import T from "@/components/shared/translate";
import { gql, useMutation } from "@/components/api";
import ErrorMsg from "@/components/shared/messageError";

export default function DangerZone() {

	let [deleteSelf, { error }] = useMutation(gql`
		mutation deleteUserSelf {
			deleteUserSelf{
				code
			}
		}
	`)


	async function deleteAccount() {
		if (confirm("Are you sure you want to delete your account?")) {
			const deleteResultError = await deleteSelf()

			if(!error && !deleteResultError?.code){
				await logout()
			}
		}
	}

	return <div id={styles.danger_zone}>
		<ErrorMsg error={error} />
		<div>
			<h3>Danger Zone</h3>
			<p>Here you can delete your account. This action is irreversible, your sensitive data will be removed.</p>
		</div>
		<Button className='red' onClick={deleteAccount}><T>Delete Account</T></Button>
	</div>
}