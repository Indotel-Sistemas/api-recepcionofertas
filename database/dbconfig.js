const config = {
    user: 'RAD',
    password: 'RAD2019',
    // server: 'SVR-DB01\\WEBAPP', 
    server: '192.168.100.32',
    database: 'RECEPCION_OFERTAS',
    options:{
        trustedconnection: true,
        enableArithAbort: true,
        trustServerCertificate: true,
        instancename : 'SQLEXPRESS'
    }
};



module.exports = {
    config,
}
