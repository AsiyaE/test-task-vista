 document.addEventListener("DOMContentLoaded", init);
// document.addEventListener("load", init);

function init(){
	let currentType="presentList";
    let theadType = {
        'presentList': `<tr> <th>№ ИБ</th> <th>ФИО</th> <th>Палата</th> </tr>`,
        'quittingList': `<tr> <th>№ ИБ</th> <th>ФИО</th> <th>Причина выбытия</th> </tr>`
    }
	const buttons = document.querySelectorAll(".routebtn");
	for ( const button of buttons){
		button.addEventListener("click", handleButtonClick);
		makeRequest(button.dataset.route);
	}

	const tbody = document.querySelector("tbody");
	tbody.addEventListener("click", handleTrClick);

	/**
	 * Обработчик нажатия на кнопки
	 * @param {Event} event
	*/
	function handleButtonClick(event) {
		const target = event.target;

		if (!(target instanceof HTMLButtonElement)) {
		return;
		}
		const route = target.dataset.route || "";
		currentType=route;

		const prevButton = document.querySelector(".routebtn.active");
		prevButton.classList.remove('active');
		target.classList.add('active');
		makeRequest(route);
	}

	async function makeRequest(route){
	
		let status = function (response) {
			if (response.status !== 200) {
			  return Promise.reject(new Error(response.statusText))
			}
			return Promise.resolve(response)
		  }
		let json = function (response) {
			return response.json()
		}

		fetch(`/${route}`)
			.then(status)
			.then(json)
			.then(function (data) {
			  console.log('data', data);
			  getList(data,route);
			})
			.catch(function (error) {
			  console.log('error', error)
			})
	}

	function getList(data,route){

		const elem = document.querySelector(`[data-route=${route}]`);
		elem.firstElementChild.textContent=data.length;
		if (currentType===route){
			showList(data);
		}
	}


	function showList(data) {
		const tbody = document.querySelector("tbody");
		const thead=document.querySelector("thead");
		thead.innerHTML=theadType[`${currentType}`];
		let tr = [];
		for(let i=0;i<data.length;i++){
			const fullName=data[i].lastName+" "+ data[i].firstName+" "+ data[i].patrName;
			tr.push(`
				<tr class='patient'
				 data-diagnosis=${data[i].diagnosis} 
				 data-birth-date=${data[i].birthDate}>
					<td>${data[i].historyNumber}</td>
					
					<td>${fullName}</td>
			`);
			if(currentType==="presentList")
				tr.push(`<td>${data[i].bedNumber}</td></tr>`);
			else
				tr.push(`<td>${data[i].cause}</td></tr>`);
		}
		tbody.innerHTML=tr.join('');
	}




	function handleTrClick(event) {
		const target = event.target.closest('tr');
		if (!target) return; // (2)

		const prevTr = document.querySelector("tr.selected");
		prevTr?.classList.remove('selected');
		target.classList.add('selected');
		getAdditionalInfo(target);
	}

	function getAdditionalInfo(target){

		const fio = document.querySelector(`[name=fio]`);
		const ageField = document.querySelector(`[name=age]`);
		const dia = document.querySelector(`[name=diagnosis]`);

		const dt1=new Date(`${target.dataset.birthDate}`)
		const dt2=new Date();
		const diff=(dt2.getTime() - dt1.getTime())/(60 * 60 * 24* 1000);
		const age=Math.abs(Math.round(diff/365.25));

		fio.value=target.querySelectorAll('td')[1].textContent;
		ageField.value=age;
		dia.value=target.dataset.diagnosis;
	}
}
