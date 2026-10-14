import React ,{ useEffect,useState} from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import apiService from '../services/api';

export default function ThreatDetails() {
   const { id } = useParams ()

   const[threat,setThreat]=useState(null);
   const[question,setQuestion] =useState('');
   const[messages,setMessages]=useState([]);
   const[loading,setLoading] =useState(false);
   const[error,setError] =useState('');

   useEffect(()=>{
    apiService.threats.getById(id)
    .then(res=> {
      setThreat(res.data);
      setMessages(res.data.conversation || []);
    })
    .catch(err=> setError(err.message));

   },[id]);
  

   const sendQuestion =async (e) => {
    e.preventDefault();
    if(!question.trim() || loading) return ;

    const text =question.trim();
    setQuestion('');
    setLoading(true);
    setError('');

    try {
      const res =await apiService.threats.chat(id,text);
      setMessages(res.data.conversation);
    }catch (err){
      setError(err.message);
      setQuestion(text);
    }finally{
      setLoading(false);
    }
   };
   if (!threat) return <p> {error || 'Loading threat....'} </p>;

   return  (
    <main style={{ padding:24, maxWidth: 800, margin: 'auto'}} >
      <button onClick={()=> window.history.back()}>Back</button>
     <h2> {threat.title}</h2>
     <p>{threat.description}</p>
       <p>Score: {threat.threatScore ??'N/A'} | Priority: {threat.priority || 'N/A'}</p>
         <p>threat.aiAnalysis?.summary</p>

         <hr/>
          <h3>Threat Follow-up Chat </h3>

          <div>
            {messages.map((m,i)=>(
              <p key={m._id || i}>
                <strong>{m.role === 'user'  ? 'You'  : 'AI'}:</strong >{m.content}
                </p>
            ))}
            </div>


            {error && <p style={{ color:'red'}}>{error}</p>}

            <form onSubmit={sendQuestion}>
              <input 
              value={question}
              onChange={e=> setQuestion(e.target.value)}
              placeholder="Ask about this threat..."
              maxLength={2000}
              disabled={loading}
              required 
              style={{width: '75% ,padding:10'}} 
               />
              <button disabled={loading} type ="submit">
                {
                  loading ? 'Thinking...' : 'Send'
                }
                </button>
                </form>
    </main>
   );
}