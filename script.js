const scoreInputs = document.querySelectorAll('input[data-student]');
const validationMessage = document.querySelector('#validation-message');

function getGrade(total) {
  if (total >= 70) return 'A';
  else if (total >= 60) return 'B';
  else if (total >= 50) return 'C';
  else if (total >= 45) return 'D';
  else if (total >= 40) return 'E';
  else return 'F';
}

function updateStudent(studentId) {
  const studentInputs = document.querySelectorAll(`input[data-student="${studentId}"]`);
  const row = studentInputs[0].closest('tr');
  const totalCell = row.querySelector('.total');
  const gradeCell = row.querySelector('.grade');
  if ([...studentInputs].some((input) => input.getAttribute('aria-invalid') === 'true')) {
    totalCell.textContent = '—';
    gradeCell.textContent = '—';
    gradeCell.removeAttribute('data-grade');
    return;
  }
  const values = [...studentInputs].map((input) => {
    if (input.value === '') return null;
    return Number(input.value);
  });

  // Keep the result blank until all four scores have been entered.
  if (values.some((value) => value === null)) {
    totalCell.textContent = '—';
    gradeCell.textContent = '—';
    gradeCell.removeAttribute('data-grade');
    return;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  totalCell.textContent = total;
  gradeCell.textContent = getGrade(total);
  gradeCell.dataset.grade = getGrade(total);
}

scoreInputs.forEach((input) => {
  input.addEventListener('input', (event) => {
    const changedInput = event.currentTarget;
    const maxScore = Number(changedInput.max);
    const score = Number(changedInput.value);
    const isValid = changedInput.value === '' ||
      (Number.isInteger(score) && score >= 0 && score <= maxScore);

    changedInput.setAttribute('aria-invalid', String(!isValid));

    if (!isValid) {
      validationMessage.textContent = `Enter a whole number from 0 to ${maxScore} for this score.`;
    } else if (![...scoreInputs].some((scoreInput) => scoreInput.getAttribute('aria-invalid') === 'true')) {
      validationMessage.textContent = '';
    }

    updateStudent(changedInput.dataset.student);
  });
});
