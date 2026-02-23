import React, { useState, useRef, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';
import Loading from './Loading';
import { UserContext } from '../context/UserContext';

const ChatQuery = () => {
	const { user } = useContext(UserContext);
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState([
		{
			sender: 'ai',
			text: 'Hi! I am your AI assistant. Ask me anything about your finances, expenses, or income.'
		}
	]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const messagesEndRef = useRef(null);

	const handleSend = async (e) => {
		e.preventDefault();
		if (!input.trim()) return;
		setError('');
		const newMessages = [
			...messages,
			{ sender: 'user', text: input }
		];
		setMessages(newMessages);
		setInput('');
		setLoading(true);
		try {
			const res = await axiosInstance.post(API_PATHS.CHATBOT.GET_QUERY_RESPONSE, {
				query: input,
				userId: user?._id
			});
            console.log("res" , res);
			
			// Handle structured response for income/expense queries
			let aiText = '';
			const data = res?.data;
			if (data?.success && ((Array.isArray(data?.income) && data.income.length) || (Array.isArray(data?.expense) && data.expense.length))) {
				if (Array.isArray(data.income) && data.income.length > 0) {
					aiText += `Here are your incomes:`;
					aiText += '\n' + data.income.map((inc, idx) =>
						`${idx + 1}. Source: ${inc.source}, Amount: ₹${inc.amount}, Date: ${new Date(inc.date).toLocaleDateString()}`
					).join('\n');
				}
				if (Array.isArray(data.expense) && data.expense.length > 0) {
					if (aiText) aiText += '\n\n';
					aiText += `Here are your expenses:`;
					aiText += '\n' + data.expense.map((exp, idx) =>
						`${idx + 1}. Category: ${exp.category || 'N/A'}, Amount: ₹${exp.amount}, Date: ${new Date(exp.date).toLocaleDateString()}`
					).join('\n');
				}
				if (!aiText) {
					aiText = 'No records found.';
				}
			} else if (typeof data?.reply === 'string') {
				aiText = data.reply;
			} else {
				aiText = 'Sorry, I could not process your request.';
			}
			setMessages([...newMessages, { sender: 'ai', text: aiText }]);
		} catch (err) {
			setMessages([...newMessages, { sender: 'ai', text: 'Sorry, something went wrong. Please try again.' }]);
			setError('Failed to get response.');
		} finally {
			setLoading(false);
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
			}, 100);
		}
	};

	// Auto-scroll to bottom on new message
	React.useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, loading]);

	return (
		<div className="w-full max-w-xl flex flex-col h-[480px] bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg shadow overflow-hidden">
			<div className="flex-1 overflow-y-auto p-4 space-y-3">
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
					>
						<div
							className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm whitespace-pre-line shadow-sm ${
								msg.sender === 'user'
									? 'bg-primary text-white rounded-br-md'
									: 'bg-slate-100 text-slate-900 rounded-bl-md'
							}`}
						>
							{msg.text}
						</div>
					</div>
				))}
				{loading && (
					<div className="flex justify-start">
						<div className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-900 text-sm animate-pulse shadow-sm">
							Thinking...
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>
			<form
				onSubmit={handleSend}
				className="flex items-center border-t border-slate-200 bg-white px-3 py-2 gap-2"
			>
				<input
					type="text"
					className="flex-1 outline-none bg-transparent px-2 py-2 text-slate-900 placeholder:text-slate-400"
					placeholder="Type your question..."
					value={input}
					onChange={e => setInput(e.target.value)}
					disabled={loading}
					autoFocus
				/>
				<button
					type="submit"
					className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed"
					disabled={loading || !input.trim()}
				>
					Send
				</button>
			</form>
			{error && <div className="text-xs text-red-500 px-4 pb-2">{error}</div>}
		</div>
	);
};

export default ChatQuery;
