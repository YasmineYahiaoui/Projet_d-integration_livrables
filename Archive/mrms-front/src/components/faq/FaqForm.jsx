import { useState } from 'react';
import faqService from '@/services/faqService';

export default function FaqForm({ onSubmit, onCancel }) {
    const [question, setQuestion] = useState('');
    const [email, setEmail] = useState('');
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState('');
    const [validation, setValidation] = useState({});

    // Valider le formulaire
    const validerFormulaire = () => {
        const erreurs = {};

        if (!question.trim()) {
            erreurs.question = 'La question est requise';
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            erreurs.email = 'L\'adresse email n\'est pas valide';
        }

        setValidation(erreurs);
        return Object.keys(erreurs).length === 0;
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validerFormulaire()) {
            return;
        }

        try {
            setChargement(true);
            setErreur('');

            const data = {
                question: question.trim(),
                email: email.trim() || undefined
            };

            const nouvelleFaq = await faqService.submitQuestion(data);

            // Informer le parent
            if (onSubmit) {
                onSubmit(nouvelleFaq);
            }

            // Réinitialiser le formulaire
            setQuestion('');
            setEmail('');
        } catch (error) {
            console.error('Erreur lors de la soumission de la question:', error);
            setErreur('Une erreur est survenue lors de la soumission de votre question. Veuillez réessayer.');
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Poser une nouvelle question</h2>

            {erreur && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p>{erreur}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                        Votre question <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 border ${
                            validation.question ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                        placeholder="Posez votre question ici..."
                    />
                    {validation.question && (
                        <p className="mt-1 text-sm text-red-600">{validation.question}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Votre email (optionnel)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                        Fournissez votre email si vous souhaitez être notifié lorsque votre question reçoit une réponse.
                    </p>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-3 py-2 border ${
                            validation.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-[#5CB1B1] focus:border-[#5CB1B1]`}
                        placeholder="exemple@email.com"
                    />
                    {validation.email && (
                        <p className="mt-1 text-sm text-red-600">{validation.email}</p>
                    )}
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            disabled={chargement}
                        >
                            Annuler
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={chargement}
                        className="px-4 py-2 bg-[#5CB1B1] text-white rounded-md hover:bg-[#4A9494] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5CB1B1] focus:ring-offset-2"
                    >
                        {chargement ? 'Envoi en cours...' : 'Soumettre la question'}
                    </button>
                </div>
            </form>
        </div>
    );
}