const verifyDocument = (document: string, docLength: number, type: string) => {
  if (!document || !docLength || !type) return false;

  if (document.length !== docLength) return false;

  if (type && type === "donation") {
    const regexCPF = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2})$/;
    return regexCPF.test(document);
  }
  if (type && type === "ong") {
    const regexCNPJ =
      /^([0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
    return regexCNPJ.test(document);
  }
  return false;
};

const verifyName = (name: string) => {
  if (name === undefined || name.length < 3 || name.length > 50) return false;
  const regex = /^[A-zÀ-Ũà-ũ]+$/;
  return regex.test(name);
};

const verifyEmail = (email: string) => {
  if (!email || email.length < 5 || email.length > 50) return false;
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

const verifyPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber || phoneNumber.length < 14 || phoneNumber.length > 15)
    return false;
  const regex =
    /^\((?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\) (?:[2-8]|9[1-9])[0-9]{2,3}\-[0-9]{4,5}$/;
  return regex.test(phoneNumber);
};

const verifyDate = (date: string) => {
  if (!date || date.length !== 10) return false;
  const regex = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/; // 01-31/01-12/1900-2099
  return regex.test(date);
};

const verifyGeneralText = (
  text: string,
  minLength: number,
  maxLength: number
) => {
  if (!text || text.length < minLength || text.length > maxLength) return false;
  const regex = /^[\w'\-,.0-9_!¡?÷?¿/\\+=@#$%&*(){}|~<>;:[\]]{1,}$/;
  return regex.test(text);
};

const validadeZipCode = (zipCode: string) => {
  if (!zipCode || zipCode.length !== 9) return false;
  const regex = /^\d{5}[\-]?\d{3}$/;
  return regex.test(zipCode);
};

const verifyUUID = (id: string) => {
  if (!id || id.length !== 36) return false;
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(id);
};

export {
  verifyDocument,
  verifyName,
  verifyEmail,
  verifyPhoneNumber,
  verifyDate,
  verifyGeneralText,
  validadeZipCode,
  verifyUUID,
};
