# CardenasTrucksLLC

App para el administrar las entregas (deliveries), administra los almacenes (stores),
los camiones (trucks), permisos de administrador y de chofer (driver).

El Chofer registra la milla en la que inicia el dia y posterior la milla final del dia.

A lo que realiza la entrega el chofer, la app envia una notificacion de la entrega , usuario y si tuvo accidente.

Visualiza el numero de millas que realizo el chofer en un rango de fechas.

La base de datos se utilizo con firebase.

El registro es por email y contraseña.

Reglas de Cloud firestore:
rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
match /{document=\*\*} {
allow read: if request.auth != null;
allow write: if request.auth != null;
}
}
}

Reglas de Storage:
rules_version = '2';
service firebase.storage {
match /b/{bucket}/o {
match /{allPaths=\*\*} {
allow read;
allow write: if request.auth != null;
}
}
}
