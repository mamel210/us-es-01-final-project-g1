
export const formatDate = (date) => {
    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);

    return formattedDate
}