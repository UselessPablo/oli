import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeSelector = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    const themes = [
        { name: 'Claro', value: 'light' },
        { name: 'Oscuro', value: 'dark' },
        { name: 'Azul', value: 'blue' },
        { name: 'Verde', value: 'green' },
    ];

    return (
        <div>
            <h3>Seleccionar Tema</h3>
            <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
            >
                {themes.map((t) => (
                    <option key={t.value} value={t.value}>
                        {t.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ThemeSelector;