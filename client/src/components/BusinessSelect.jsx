import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '@/context/AuthContext';
import { API_BASE_URL } from '@/utils/api';

/**
 * Fetches and renders a select dropdown for recruiter's businesses
 * @param {string} value - selected business id
 * @param {function} onChange - callback for select change
 * @param {boolean} required - is field required
 * @returns JSX.Element
 */
const BusinessSelect = ({ value, onChange, required = false }) => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchBusinesses = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_BASE_URL}/business/recruiter`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to fetch businesses');
                const bizList = data.data.businesses || [];
                setBusinesses(bizList);
                // If no value is selected and businesses exist, select the first by default
                if (bizList.length && !value) {
                    onChange(bizList[0].id);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (accessToken) fetchBusinesses();
    }, [accessToken, onChange, value]);

    if (loading) return <select disabled className="w-full px-3 py-2.5 border-2 border-gray-300 rounded"><option>Loading...</option></select>;
    if (error) return <div className="text-red-500 text-sm">{error}</div>;
    if (!businesses.length) return <div className="text-gray-500 text-sm">No businesses found. <Link to="/add-business" className="text-primary underline">Add one</Link></div>;

    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            required={required}
            className="w-full max-w-lg px-3 py-2.5 border-2 border-gray-300 rounded"
        >
            {businesses.map(biz => (
                <option key={biz.id} value={biz.id}>{biz.name}</option>
            ))}
        </select>
    );
};

export default BusinessSelect;
