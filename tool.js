function getValue(fieldName){
  var field = document.getElementById(fieldName);
  return field.value;
}
function resetFields(){
  var inputs = document.getElementsByTagName('input');
  for(var i = 0; i < inputs.length-2; i++) {
    inputs[i].value = "";
  }

  var selects = document.getElementsByTagName('select');
  for(var i = 0; i < selects.length; i++) {
    selects[i].value = "";
  }

  var results = document.getElementsByTagName('p');
  for(var i = 0; i < results.length; i++) {
    results[i].textContent = "";
  }
  var headers = document.getElementsByTagName('h3');
  for(var i = 0; i < headers.length; i++) {
    headers[i].textContent = "";
  }
}
function runTool(){
  const fev1_arg = getValue("fev1");
  const fvc_arg = getValue("fvc");
  const tlc_arg = getValue("tlc");
  const frc_arg = getValue("frc");
  const rv_arg = getValue("rv");
  const dlco_arg = getValue("dlco");
  const va_arg = getValue("va");
  const kco_arg = getValue("kco");

  var spirometry_results = spirometry(fev1_arg, fvc_arg);
  var lung_volumes_results = lung_volumes(tlc_arg, frc_arg, rv_arg, fev1_arg, fvc_arg);
  var diffusing_cap_results = diffusing_cap(dlco_arg, va_arg, kco_arg);
  
  document.getElementById("spir").textContent = spirometry_results;
  document.getElementById("lungvol").textContent = lung_volumes_results;
  document.getElementById("diffcap").textContent =diffusing_cap_results;
  document.getElementById("spir_header").innerText = "Spirometry: ";
  document.getElementById("lungvol_header").innerText = "Lung Volumes: ";
  document.getElementById("diffcap_header").innerText = "Diffusing Capacity: ";

  
};
function spirometry(fev1, fvc){
  if (fev1 == "" || fvc == ""){
    return "Input Value Missing. Please try again."
  }
  if (fev1/fvc > 0.05){
    if (fvc > 0.05){
      return "Normal spirometry";
    }
    return "Possible restriction or non-specific pattern, Need lung volumes";
  } else {
    if (fvc > 0.05){
      return "airflow obstruction";
    } else {
      return "Possible mixed disorder, Need lung volumes";
    }
  }
};

function lung_volumes(tlc, frc, rv, fev1, fvc){
  if (fev1 == "" || fvc == "" || tlc == "" || frc == "" || rv == ""){
    return "Input Value Missing. Please try again."
  }
  var frc_tlc = frc/tlc
  var rv_tlc = rv/tlc
  var fev1_fvc = fev1/fvc
  if (tlc < 0.05){
    if (frc_tlc > 0.95 || rv_tlc > 0.95){
      if (fev1_fvc < 0.05){
        return "Restriction, Mixed disorder";
      } else {
        return "Complex Restriction";
      }
    } else {
      return "Simple Restriction";
    }
  } else {
    if (tlc > 0.95){
      if (frc_tlc > 0.95 || rv_tlc > 0.95){
        return "Hyperinflation";
      } else {
        return "Large lungs";
      }
    } else {
      if (frc_tlc > 0.95 || rv_tlc > 0.95){
        return "Hyperinflation";
      } else {
        return "Normal Lung Volumes";
      }
    }
  }
};

function diffusing_cap(dlco, va, kco){
  if (dlco == "" || va == "" || kco == ""){
    return "Input Value Missing. Please try again."
  }
  if (dlco < 0.05) {
    if (va == "normal"){
      return "Pulmonary vascular abnormality (e.g. pulmonary hypertension, pulmonary embolism, vasculitis). Emphysema with preserved lung volume (e.g. early ILD) Anaemia.";
    } else if (va == "low"){
      if (kco == "low/normal"){
        return "loss of alveolar capillary structure with loss of lung volume (e.g. emphysema, ILD)";
      } else if (kco == "high"){
        return "Localised loss of lung volume (e.g. pneumonectomy). Incomplete lung expansion (e.g. failure to take deep breath, neuromuscular dysfunction).";
      }
    }
  } else if (dlco > 0.95) {
    return "Increased blood flow (e.g. left-to-right shunt, asthma, obesity) Erythrocytosis, Alveolar haemorrahage.";
  }
  else {
    return "Within normal range.";
  }
};