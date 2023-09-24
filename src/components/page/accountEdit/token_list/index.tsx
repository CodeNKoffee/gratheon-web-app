import React, { useState } from 'react';
import copy from 'clipboard-copy';

import ErrorMsg from '@/components/shared/messageError'
import Button from '@/components/shared/button';
import { gql, useQuery, useMutation } from '@/components/api/index'
import Loader from '@/components/shared/loader'
import { gatewayUri } from '@/components/uri'

interface Token {
	id: number;
	value: string;
}

const TokenList: React.FC = () => {
	const { loading, error, data } = useQuery(gql`
		{
			api_tokens {
				id
				token
			}
		}
	`)

	let [generateToken, { error: generationError }] = useMutation(gql`
	mutation generateApiToken {
		generateApiToken {
			id
			token
		}
	}
`)

	const [generatingToken, setGenerating] = useState(false)
	async function onGenerateToken() {
		setGenerating(true);
		const result = await generateToken()
		hiddenTokens.push(result.data.generateApiToken.id)
		tokens.push(result.data.generateApiToken)
		setGenerating(false);
	}

	if (loading) {
		return <Loader />
	}

	const tokens = data.api_tokens

	const initialHiddenTokens: number[] = tokens.map((token) => token.id);
	const [hiddenTokens, setHiddenTokens] = useState<number[]>(initialHiddenTokens);

	const toggleToken = (id: number) => {
		if (hiddenTokens.includes(id)) {
			setHiddenTokens(hiddenTokens.filter((tokenID) => tokenID !== id));
		} else {
			setHiddenTokens([...hiddenTokens, id]);
		}
	};

	const copyToken = (token: string) => {
		copy(token);
		// You can provide some feedback to the user that the token was copied, e.g., a toast or a message.
	};

	const gate_url = gatewayUri()
	const htmlCode = `curl --location '${gate_url}' \\
--header 'Content-Type: application/json' \\
--data '{"query":"{ apiaries { id name } }"}' \\
--header 'Authorization: Bearer API_TOKEN_HERE'`;

	const style = "background-color:#babca9; font-size:12px;padding:3px 5px; border-radius:3px;font-family:Consolas,Monospace;margin:0;"
	return (
		<div style="padding:10px">
			<h3>API tokens</h3>
			<ErrorMsg error={error || generationError} />

			<table>
				<tbody>
					{tokens.map((token) => (
						<tr key={token.id}>
							<td style="min-width:200px">
								<div style={style}>
									{hiddenTokens.includes(token.id) ? '*'.repeat(token.token.length) : token.token}
								</div>
							</td>
							<td>
								<Button className='small' onClick={() => copyToken(token.token)}>Copy</Button>
								<Button className='small' onClick={() => toggleToken(token.id)}>Toggle</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<Button className='green' loading={generatingToken} onClick={onGenerateToken}>Generate</Button>

			<p>You can use <a href="https://github.com/Gratheon/raspberry-pi-client">raspberry PI client</a> or access API directly with API tokens:</p>
			<div style="display:flex">
				<pre style={`${style}`} dangerouslySetInnerHTML={{ __html: htmlCode }} />
				<Button onClick={() => copy(htmlCode)}>Copy</Button>
			</div>
		</div>
	);
};

export default TokenList;
