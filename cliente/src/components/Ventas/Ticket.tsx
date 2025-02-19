import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 10, // Ajustar el padding si es necesario
    },
    section: {
        marginBottom: 10,
    },
    centeredText: {
        textAlign: 'center',
        fontSize: 10, // Reducir el tamaño de la fuente
    },
    centeredTexttwo: {
        textAlign: 'center',
        fontSize: 8, // Reducir el tamaño de la fuente
        marginLeft: 5
    },
    text: {
        fontSize: 10, // Reducir el tamaño de la fuente
        marginLeft:9
    },
    table: {
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableCol: {
        width: "33%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 8, // Reducir el tamaño de la fuente
        paddingLeft: 5, // Agrega un padding a la izquierda
        paddingRight: 5, // Agrega un padding a la derecha
    }
});

const TicketPDF = ({ venta }: { venta: any }) => {
    console.log("Venta recibida", venta);
    return (
        <Document>
            <Page size={{ width: 198, height: 'auto' }} style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.centeredText}>{venta.nombreEmpresa}</Text>
                    <Text style={styles.centeredText}>R.U.C:{venta.rucEmpresa}</Text>
                    <Text style={styles.centeredText}>Número de Timbrado: {venta.timbradoEmpresa}</Text>
                    <Text style={styles.centeredTexttwo}>Dirección: {venta.direccionEmpresa}</Text>
                    <Text style={styles.text}>Cliente: {venta.nombreCliente}</Text>
                    <Text style={styles.text}>R.U.C: {venta.rucCliente}</Text>               
                    <Text style={styles.text}>N° Interno: {venta.numeroInterno}</Text>
                    <Text style={styles.text}>N° Factura: {venta.facturaNumero}</Text>
                    <Text style={styles.text}>Fecha Venta: {venta.fechaVenta}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.centeredText}>Productos</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Producto</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Cantidad</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Precio Unit.</Text>
                            </View>
                        </View>
                        {venta.productos.map((producto:any, index:any) => (
                            <View style={styles.tableRow} key={index}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{producto.nombreProducto}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{producto.cantidadVendida}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{producto.precioVenta}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.text}>Total: {venta.precioVentaTotal}</Text>
                    <Text style={styles.text}>Iva 10%: {venta.iva10 ? venta.iva10.toFixed(2) : 'N/A'}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default TicketPDF;