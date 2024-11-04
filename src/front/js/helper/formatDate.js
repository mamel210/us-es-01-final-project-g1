export const formatDate = (_date) => {
    const date = new Date(_date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes en formato 2 dígitos
    const day = String(date.getDate()).padStart(2, '0'); // Día en formato 2 dígitos
    return `${year}-${month}-${day}`;
}
