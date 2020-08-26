import React, {useState, useEffect} from 'react';
import Modal from 'react-modal';
import * as api from '../api/apiService'

//passara aonde o react fica
Modal.setAppElement('#root')

export default function ModalGrade({onSave, onClose, selectedGrade}) {
  const { id, student, subject, type, value } = selectedGrade;

    const[gradeValue, setGradeValue] = useState(value);
    const [gradeValidation, setGradeValidation] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        const validation = api.getValidationFromGradeType(type);
        setGradeValidation(validation);
    },[type]); 

    useEffect(() => {
        const { minValue, maxValue } = gradeValidation;
    
        if (gradeValue < minValue || gradeValue > maxValue) {
          setErrorMessage(
            `O valor da nota deve ser entre ${minValue} e ${maxValue} (inclusive)`
          );
          return;
        }
    
        setErrorMessage('');
      }, [gradeValue, gradeValidation]);
    

    useEffect(() =>{
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    });
    
    const handleKeyDown = (event) => {
        if (event.key === 'Escape'){
            onClose(null);
        }
    }

    const handleFormSubmit = (event) => {};

    return( <div>
        <Modal isOpen={true}> 
            <form onSubmit ={handleFormSubmit}>
                 <div className="input-field">
            <input id="inputName" type="text" value={student} readOnly />
            <label className="active" htmlFor="inputName">
              Nome do aluno:
            </label>
          </div>
            </form>
        </Modal>
    </div>
    ); 
}
