document.addEventListener("DOMContentLoaded", () => {
  const studentListEl = document.getElementById("studentList");
  const selectedStudentEl = document.getElementById("selectedStudent");
  const attendanceFormEl = document.getElementById("attendanceForm");
  const attendanceDateEl = document.getElementById("attendanceDate");
  const attendanceMsgEl = document.getElementById("attendanceMsg");

  let selectedStudent = null;

  // 학생 검색 버튼 클릭
  document.getElementById("searchStudentBtn").addEventListener("click", async () => {
    const grade = document.getElementById("gradeInput").value;
    const classNum = document.getElementById("classInput").value;
    const number = document.getElementById("numberInput").value;

    // 예시 더미 데이터
    const students = [
      { id: 1, name: "홍길동", grade: 1, class: 1, number: 1 },
      { id: 2, name: "김철수", grade: 1, class: 1, number: 2 }
    ].filter(s =>
      (!grade || s.grade == grade) &&
      (!classNum || s.class == classNum) &&
      (!number || s.number == number)
    );

    studentListEl.innerHTML = "";
    students.forEach(s => {
      const li = document.createElement("li");
      li.textContent = `${s.grade}학년 ${s.class}반 ${s.number}번 ${s.name}`;
      const selectBtn = document.createElement("button");
      selectBtn.textContent = "선택";
      selectBtn.addEventListener("click", () => selectStudent(s));
      li.appendChild(selectBtn);
      studentListEl.appendChild(li);
    });
  });

  // 학생 선택
  function selectStudent(student) {
    selectedStudent = student;
    selectedStudentEl.textContent = `선택: ${student.grade}학년 ${student.class}반 ${student.number}번 ${student.name}`;
    attendanceFormEl.classList.remove("hidden");
    attendanceMsgEl.textContent = "";

    // 출결 버튼 이벤트 연결
    const statusBtns = document.querySelectorAll(".statusBtn");
    statusBtns.forEach(btn => {
      btn.onclick = async () => {
        if (!selectedStudent) return alert("학생을 선택하세요.");
        const status = btn.dataset.status;
        const date = attendanceDateEl.value;
        if (!date) return alert("날짜/시간을 선택하세요.");

        // TODO: 실제 백엔드 POST 호출
        // await fetch('/attendance', { method: 'POST', body: JSON.stringify({student_id: selectedStudent.id, date, status}) })

        attendanceMsgEl.textContent = `${selectedStudent.name} 학생의 출결을 '${status}'로 등록했습니다.`;
      };
    });
  }
});
