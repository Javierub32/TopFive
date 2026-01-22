import { useState } from 'react';
import { userSearchService } from '../services/userSearchServices';

export const useSearchUser = () => {
	const [busqueda, setBusqueda] = useState('');
	const [resultados, setResultados] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	const handleSearch = async () => {
		if (!busqueda.trim()) return;
		setLoading(true);
		try {
			const users = await userSearchService.fetchUsers(busqueda.trim());
			setResultados(users || []);
		} catch (error) {
			console.error('Error searching users:', error);
		} finally {
			setLoading(false);
		}
	};

	return {
		busqueda,
		setBusqueda,
		resultados,
		loading,
		handleSearch,
	};
};