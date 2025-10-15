import React, { useState, useCallback } from 'react';
import { suggestDishName } from './services/geminiService';
import { TextInput } from './components/TextInput';
import { NumberInput } from './components/NumberInput';
import { TextArea } from './components/TextArea';
import { Button } from './components/Button';
import { ChefHatIcon } from './components/icons/ChefHatIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { WhatsAppIcon } from './components/icons/WhatsAppIcon';
import { TrashIcon } from './components/icons/TrashIcon';

type OrderItem = {
  id: number;
  dishName: string;
  quantity: string;
};

type SubmissionStatus = 'idle' | 'success' | 'error';

const presetDishes = [
  'Linguine alle vongole',
  'Linguine frutti di mare',
  'Penne all\'arrabbiata',
  'Penne zola e noci',
  'Penne al sugo baby',
  'Tagliata alle verdure',
  'Tagliata con patatine',
  'Patatine fritte',
  'Olive ascolane',
  'Anelli di cipolla',
];

function App() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [modifications, setModifications] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const addDish = (name: string = '') => {
    const newItem: OrderItem = {
      id: Date.now(),
      dishName: name,
      quantity: '1',
    };
    setOrderItems(prevItems => [...prevItems, newItem]);
  };

  const removeDish = (id: number) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateDish = (id: number, field: 'dishName' | 'quantity', value: string) => {
    setOrderItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSuggestDish = useCallback(async () => {
    setIsLoadingSuggestion(true);
    setError(null);
    try {
      const suggestion = await suggestDishName();
      addDish(suggestion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setSubmissionStatus('error');
    } finally {
      setIsLoadingSuggestion(false);
    }
  }, []);

  const resetForm = () => {
    setOrderItems([]);
    setTableNumber('');
    setModifications('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (orderItems.length === 0 || !tableNumber) {
      setError('Aggiungere almeno un piatto e specificare il numero del tavolo.');
      setSubmissionStatus('error');
      return;
    }
    if (orderItems.some(item => !item.dishName.trim() || !item.quantity.trim() || parseInt(item.quantity) < 1)) {
       setError('Controlla che tutti i piatti abbiano un nome e una quantità valida (almeno 1).');
       setSubmissionStatus('error');
       return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSubmissionStatus('idle');

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmissionStatus('success');
    resetForm();
    setTimeout(() => setSubmissionStatus('idle'), 3000);
  };
  
  const handleSendWhatsApp = () => {
    if (orderItems.length === 0 || !tableNumber || !whatsappNumber) {
      setError('Per inviare su WhatsApp, sono necessari almeno un piatto, il tavolo e il numero WhatsApp.');
      setSubmissionStatus('error');
      return;
    }
     if (orderItems.some(item => !item.dishName.trim() || !item.quantity.trim() || parseInt(item.quantity) < 1)) {
       setError('Controlla che tutti i piatti abbiano un nome e una quantità valida (almeno 1).');
       setSubmissionStatus('error');
       return;
    }
    setError(null);
    setSubmissionStatus('idle');

    const dishesText = orderItems.map(item => `- ${item.dishName} (x${item.quantity})`).join('\n');
    const message = `*Nuova Comanda*\n---------------------\n*Tavolo:* ${tableNumber}\n---------------------\n${dishesText}${modifications ? `\n---------------------\n*Modifiche:* ${modifications}` : ''}\n---------------------`;
    
    const cleanedPhoneNumber = whatsappNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanedPhoneNumber}?text=${encodedMessage}`;
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-lg mx-auto">
        <header className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-4 rounded-full shadow-lg mb-4">
            <ChefHatIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Ordinazione Comande</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Invia una nuova comanda alla cucina.</p>
        </header>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">Comande Veloci</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {presetDishes.map((dish) => (
                <button
                  key={dish}
                  type="button"
                  onClick={() => addDish(dish)}
                  className="w-full py-4 px-2 text-center text-sm sm:text-base font-semibold bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-all duration-200 active:scale-95"
                >
                  {dish}
                </button>
              ))}
            </div>
        </section>

        <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 -mb-2">Elenco Piatti</label>
              {orderItems.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  Nessun piatto aggiunto.
                </p>
              )}
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <TextInput
                    value={item.dishName}
                    onChange={(e) => updateDish(item.id, 'dishName', e.target.value)}
                    placeholder="Nome Piatto"
                    required
                    className="flex-grow"
                  />
                  <NumberInput
                    value={item.quantity}
                    onChange={(e) => updateDish(item.id, 'quantity', e.target.value)}
                    min="1"
                    required
                    className="w-20"
                    placeholder="Q.tà"
                  />
                  <Button type="button" onClick={() => removeDish(item.id)} variant="secondary" className="!p-3 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50">
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
                <Button type="button" onClick={() => addDish()} className="w-full">
                  Aggiungi Piatto
                </Button>
                 <Button type="button" onClick={handleSuggestDish} disabled={isLoadingSuggestion} variant="secondary" className="!px-3 !py-3">
                  <SparklesIcon className={`h-5 w-5 ${isLoadingSuggestion ? 'animate-spin' : ''}`}/>
                </Button>
            </div>


            <div>
              <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numero Tavolo</label>
              <NumberInput
                id="tableNumber"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Es. 12"
                required
              />
            </div>

            <div>
              <label htmlFor="modifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Richiesta di Modifica (Opzionale)</label>
              <TextArea
                id="modifications"
                value={modifications}
                onChange={(e) => setModifications(e.target.value)}
                placeholder="Es. Senza pepe, cottura al dente..."
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">N. WhatsApp Cucina</label>
              <TextInput 
                id="whatsappNumber"
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Es. 393123456789"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Invio in corso...' : 'Invia Comanda'}
              </Button>
              <Button 
                type="button" 
                onClick={handleSendWhatsApp} 
                className="w-full bg-green-500 hover:bg-green-600 focus:ring-green-400 text-white flex items-center justify-center"
              >
                <WhatsAppIcon className="h-5 w-5 mr-2" />
                Invia su WhatsApp
              </Button>
            </div>
          </form>

          {submissionStatus !== 'idle' && (
            <div className="mt-4 text-center text-sm">
              {submissionStatus === 'success' && <p className="text-green-600 dark:text-green-400">Comanda inviata con successo!</p>}
              {submissionStatus === 'error' && error && <p className="text-red-600 dark:text-red-400">{error}</p>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;