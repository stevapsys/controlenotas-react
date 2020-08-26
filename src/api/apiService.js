import axios from 'axios'; 

//NO BACKEND, A PORTA USADA É A 3000
const API_URL ='http://localhost:3001/grade';

//VALIDANDO AS NOTAS
const GRADE_VALIDATION = [
  {
    id: 1,
    gradeType: 'Exercícios',
    minValue: 0,
    maxValue: 10,
  },
  {
    id: 2,
    gradeType: 'Trabalho Prático',
    minValue: 0,
    maxValue: 40,
  },
  {
    id: 3,
    gradeType: 'Desafio',
    minValue: 0,
    maxValue: 50,
  }
];

//PEGANDO OS DADOS DA API
async function getAllGrades () {
  //USAR O AXIOS NO LUGAR DO FETCH
  const res = await axios.get(API_URL);

  //para retornar toda a API
  //return res

  //puxando só as infos de notas da API 
  const grades = res.data.grades.map((grade) => {

    const { student, subject, type} = grade; 
    return {
      ...grade,
      //trazendo os dados com letras minusculas 
      studentLowerCase: student.toLowerCase(),
      subjectLowerCase: subject.toLowerCase(),
      typeLowerCase: type.toLowerCase(),
      //para não vir nada deletado da API
      isDeleted: false, 
    };
  });
  
  //return grades;

  //a função Set evita que os alunos se repitam 
  let allStudents = new Set();
  //forEach para percorrer todos os alunos passando a função de SET
  grades.forEach(grade => allStudents.add(grade.student)); 
  //o SET não retorna os resultados em array, então é preciso voltar para array
  allStudents = Array.from(allStudents);

  //return allStudents

  let allSubjects = new Set();
  grades.forEach(grade => allSubjects.add(grade.subject)); 
  allSubjects = Array.from(allSubjects);

  //return allSubjects

  let allGradesTypes = new Set();
  grades.forEach(grade => allGradesTypes.add(grade.type)); 
  allGradesTypes = Array.from(allGradesTypes);

  //return allGradesTypes

  //criando o maxID para adicionar um novo id abaixo
  let maxId = -1; 
  grades.forEach(({id}) => {
    if (id > maxId) {
      maxId = id; 
    }
  });
  //para adicionar um novo id 
  let nextId = grades.maxId + 1; 

  //fazendo um vetor para percorer as três infos
  const allCombinations = [];
  allStudents.forEach(student => {
    allSubjects.forEach(subject => {
      allGradesTypes.forEach(type => {
        allCombinations.push({
          student,
          subject,
          type
        });
      });
    });
  });

    allCombinations.forEach(({student, subject, type}) => {

      //se eu tenho o item, checar as infos 
      const hasItem = grades.find ((grade) => {
        return grade.subject === subject && 
        grade.student === student && 
        grade.type === type;
      }); 

      //se eu não tenho o item, criar  
      if(!hasItem) {
        grades.push({
          id: nextId++,
          student,
          studentLowerCase: student.toLowerCase(),
          subject,
          subjectLowerCase: subject.toLowerCase(),
          type,
          typeLowerCase: type.toLowerCase(),
          //valor começa em 0 
          value: 0,
          isDeleted: true
      }); 
    }
  }); 

  //return allCombinations

  //fazendo a ordenação dos itens

  grades.sort((a,b) => a.typeLowerCase.localeCompare(b.typeLowerCase));
  grades.sort((a,b) => a.subjectLowerCase.localeCompare(b.subjectLowerCase));
  grades.sort((a,b) => a.studentLowerCase.localeCompare(b.studentLowerCase));


    return grades; 

}

//INSERINDO UM NOVO DADO
async function insertGrades(grade){
  const response = await axios.post(API_URL, grade);
  return response.data.id;
};

//EDITANDO UM DADO
async function updateGrade(grade){
  const response = await axios.put(API_URL, grade);
  return response.data;
};

//DELETANDO UM DADO
async function deleteGrade(grade){
  const response = await axios.delete(`${API_URL}/${grade.id}`);
  return response.data;
}; 

async function getValidationFromGradeType(gradeType) {
  const gradeValidation = GRADE_VALIDATION.find(
    (item) => item.gradeType === gradeType
  );

  const { minValue, maxValue } = gradeValidation;

  return {
    minValue,
    maxValue,
  };
}

export { getAllGrades, insertGrades, updateGrade, deleteGrade, getValidationFromGradeType };