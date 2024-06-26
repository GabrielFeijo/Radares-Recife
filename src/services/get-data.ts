import axios from 'axios';

export const getData = async () => {
	try {
		const response = await axios.get(process.env.NEXT_PUBLIC_API_URL || '', {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
};
