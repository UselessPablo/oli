import { useState, useEffect } from "react";

const SubirImagen = ({ onUpload, multiple = false, initialImages = [] }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [urls, setUrls] = useState(initialImages);
    const [error, setError] = useState(null);

    // Verificación de variables de entorno
    const cloudName = "pablo1978"; // Usa tu cloud_name real
    const uploadPreset = "miPreset"; // Usa tu preset real

    useEffect(() => {
        if (!cloudName || !uploadPreset) {
            console.error('Configuración de Cloudinary faltante:', {
                cloudName,
                uploadPreset
            });
            setError('Configuración de Cloudinary incompleta');
        }

        setUrls(initialImages);
    }, [initialImages]);

    const handleUpload = async () => {
        if (!cloudName || !uploadPreset) {
            setError('Configuración de Cloudinary no válida');
            return;
        }

        if (files.length === 0) {
            setError('No hay archivos seleccionados');
            return;
        }

        setLoading(true);
        setError(null);
        const newUrls = [];

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);
                formData.append("cloud_name", cloudName);
                formData.append("timestamp", Date.now());

                console.log('Enviando a Cloudinary con:', {
                    cloudName,
                    uploadPreset
                });

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    { method: "POST", body: formData }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || 'Error en Cloudinary');
                }

                const data = await response.json();
                if (data.secure_url) {
                    let secureUrl = data.secure_url.replace('http://', 'https://');
                    newUrls.push(secureUrl);
                }
            }

            const updatedUrls = multiple ? [...urls, ...newUrls] : newUrls;
            setUrls(updatedUrls);
            onUpload(updatedUrls);
        } catch (error) {
            console.error("Error subiendo imágenes:", error);
            setError("Error al subir imágenes: " + error.message);
        } finally {
            setLoading(false);
        }
    };
    // Función para manejar la selección de archivos en Android
    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // En Android, podemos intentar acceder a más archivos
        if (window.AndroidInterface) {
            try {
                // Si tenemos acceso a la interfaz Android
                const androidFiles = window.AndroidInterface.getFiles();
                if (androidFiles && androidFiles.length > 0) {
                    setFiles([...selectedFiles, ...androidFiles]);
                    return;
                }
            } catch (error) {
                console.log("No se pudo acceder a la interfaz Android");
            }
        }

        setFiles(selectedFiles);
        setError(null);
    };

    return (
        <div className="subirFoto">
            <input
                className="inputProd"
                type="file"
                onChange={handleFileSelect}
                multiple={multiple}
                accept="image/*"
                disabled={loading}
            
           
            />
            {navigator.userAgent.toLowerCase().includes('android') && (
                <button
                    className="login"
                    onClick={() => {
                        if (window.AndroidInterface) {
                            window.AndroidInterface.openFilePicker();
                        } else {
                            document.getElementById('fileInput').click();
                        }
                    }}
                >
                    Buscar en dispositivo
                </button>
            )}
            <button
                className="login"
                onClick={handleUpload}
                disabled={loading || files.length === 0}
            >
                {loading ? 'Subiendo...' : `Subir ${multiple ? 'Imágenes' : 'Imagen'}`}
            </button>

            {error && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                    Error: {error}
                </div>
            )}

            {urls.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                    <p>Imágenes subidas: {urls.length} ✅</p>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        marginTop: '10px',
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }}>
                        {urls.map((url, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                                <img
                                    src={url}
                                    alt={`Preview ${index}`}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'cover',
                                        borderRadius: '4px'
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder.jpg';
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const updatedUrls = urls.filter((_, i) => i !== index);
                                        setUrls(updatedUrls);
                                        onUpload(updatedUrls);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '-5px',
                                        right: '-5px',
                                        background: 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ×
                                </button>
                                <input
                                    id="fileInput"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelect}
                                    multiple={multiple}
                                    accept="image/*"
                                />
                            
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubirImagen;