import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../Firebase/FirebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Questionario from './Questionario';
import './GoogleAuth.css';
import EditarUsuario from './EditarUsuario';

function GoogleAuth() {
  const [usuario, setUsuario] = useState(null);
  const [questionarioCompleto, setQuestionarioCompleto] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);

  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUsuario(user);
        axios.get(`http://localhost:8080/contas/user?uid=${user.uid}`)
          .then((response) => {
            const userData = response.data;
            setQuestionarioCompleto(userData.questionarioCompleto);

            if (!userData.questionarioCompleto) {
              setMostrarModal(true);
            }
          })
          .catch((error) => {
            console.error('Erro ao buscar informações do usuário:', error);
          });
      } else {
        setUsuario(null);
        setMostrarModal(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const Login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      if (currentUser) {
        const idToken = await currentUser.getIdToken(true);
        const response = await axios.post('http://localhost:8080/contas/login', { idToken });

        const userInfo = response.data;
        console.log('Informações do usuário:', userInfo);

        const userDetails = await axios.get(`http://localhost:8080/contas/user?uid=${userInfo.uid}`);
        setUsuario(userDetails.data);
        setQuestionarioCompleto(userDetails.data.questionarioCompleto);

        if (!userDetails.data.questionarioCompleto) {
          setMostrarModal(true);
        }
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8080/contas/logout');
      setUsuario(null);
      setQuestionarioCompleto(false);
      setMostrarModal(false);
      await auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleQuestionarioEnviado = () => {
    setQuestionarioCompleto(true);
    setMostrarModal(false);
    setMostrarEditar(true);
    alert('Questionário enviado com sucesso!');
  };

  return (
    <div>
      {usuario ? (
        <div className="usuario-container">
          <div>
            {usuario.photoURL && (
              <img className="usuario-foto" src={usuario.photoURL} alt="Foto do usuário" />
            )}
          </div>
          <div className="usuario-info">
            <h2>{usuario.displayName || 'Usuário'}</h2>
            <p><strong>Email:</strong> {usuario.email}</p>
            <button onClick={logout}>Logout</button>

            {questionarioCompleto ? (
              <button onClick={() => setMostrarEditar(true)}>Editar Usuário</button>
            ) : (
              <button onClick={() => setMostrarModal(true)}>Preencher Questionário</button>
            )}

            {mostrarEditar && (
              <EditarUsuario uid={usuario.uid} onClose={() => setMostrarEditar(false)} />
            )}

            {mostrarModal && !questionarioCompleto && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2>Preencha o Questionário</h2>
                  </div>
                  <Questionario uid={usuario.uid} onQuestionarioEnviado={handleQuestionarioEnviado} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button onClick={Login}>Login com Google</button>
      )}
    </div>
  );
}

export default GoogleAuth;
