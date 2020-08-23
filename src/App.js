import React, {useState, useEffect} from 'react'; 
import * as api from './api/apiService';
import Spinner from './components/Spinner';
import GradesControl from './components/GradesControl';


export default function App () {
    //testando a API
    // const testeApi = async () => {
    //   const result = await api.getAllGrades();
    //   console.log(result);
    // } 
    // testeApi();

    const [allGrades, setAllGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false); 

    //caregar as notas
    useEffect(()=> {
      const getGrades = async () => {
        const grades = await api.getAllGrades();
        setTimeout(()=> {
          setAllGrades(grades); 
        },2000);
      }
     /*  api.getAllGrades().then((grades) => {
      //para forçar um atraso de 2 segundos
      setTimeout(()=> {
        setAllGrades(grades); 
      },2000);
    });  */

      getGrades();
    }, []); 

    const handleDelete = () => {
      console.log('handleDelete');
    }

    const handlePersist = () => {
      console.log('handlePersist');
    }


    return (
    <div className="container">
      <h1 className="center">Controle de Notas</h1>
      {/* Se for igual a 0, ou seja, nada, mostra o spinner de carregando */}
      {allGrades.length == 0 &&  <Spinner />}

      {/* Se for maior que zero, carrega o gradesControl */}

      {allGrades.length > 0 &&  <GradesControl 
      grades={allGrades} 
      onDelete={handleDelete}
      onPersist={handlePersist}
      />}
    </div>
    ); 
}