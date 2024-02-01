class ServiceModel {
    static async getAllServices() {
        try {
            const query = 'SELECT * FROM services';
            const [services] = await readDb.query(query);
            return services;
        } catch (error) {
            console.log(error)
            throw new Error('Error fetching services.');
        }
    }
    static async getServiceById(serviceId) {
        try {
          const query = 'SELECT * FROM services WHERE id = ?';
          const [service] = await readDb.query(query, [serviceId]);
          return service;
        } catch (error) {
                console.error(error);
          throw new Error('Error fetching service.');
        }
      }
    static async addService(serviceData) {
        try {
            const {
                service_name,
                price,
                // thumbnail,
            } = serviceData;

            const query =
                'INSERT INTO services (service_name, price) VALUES (?, ?)';
            const values = [
                service_name,
                price,
            ];

            const [result] = await writeDb.query(query, values);
            return result.affectedRows > 0 ? result.insertId : false;
        } catch (error) {
            console.log(error)
            throw new Error('Error adding service.');
        }
    }

    static async updateService(serviceId, updatedServiceData) {
        try {
            const {
                service_name,
                price,
            } = updatedServiceData;

            const query =
                'UPDATE services SET service_name = ?, price = ? WHERE id = ?';
            const values = [
                service_name,
                price,
                serviceId,
            ];

            const [result] = await writeDb.query(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.log(error)
            throw new Error('Error updating service.');
        }
    }
    static async deleteService(serviceId) {
        try {
            const query = 'DELETE FROM services WHERE id = ?';
            const [result] = await writeDb.query(query, [serviceId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.log(error)
            throw new Error('Error deleting service.');
        }
    }

    //service request functions
    static async addServiceRequest(serviceRequestData) {
        try {
            const {
                service_id,
                user_id,
                patient_name,
                patient_age,
                patient_sex,
                patient_complaints,
                patient_history,
                patient_family_history,
                patient_phone_number,
                patient_consultation_time,
                // thumbnail,
            } = serviceRequestData;

            const query =
                'INSERT INTO service_requests ( service_id, user_id, patient_name, patient_age, patient_sex, patient_complaints, patient_history, patient_family_history, patient_phone_number, patient_consultation_time ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [
                service_id,
                user_id,
                patient_name,
                patient_age,
                patient_sex,
                patient_complaints,
                patient_history,
                patient_family_history,
                patient_phone_number,
                patient_consultation_time,
            ];

            const [result] = await writeDb.query(query, values);
            return result.affectedRows > 0 ? result.insertId : false;
        } catch (error) {
            console.log(error)
            throw new Error('Error adding service request.');
        }
    }
    static async getServiceRequests() {
        try {
            const query = `SELECT sr.*,u.name as user,ss.service_name 
            FROM service_requests sr 
            JOIN services ss ON sr.service_id = ss.id 
            JOIN users u ON sr.user_id = u.id`;
            const [services] = await readDb.query(query);
            return services;
        } catch (error) {
            console.log(error)
            throw new Error('Error fetching service requests.');
        }
    }
    static async getServiceRequestsByUser(userId) {
        try {
            const query = `SELECT sr.*,u.name as user,ss.service_name 
            FROM service_requests sr 
            JOIN services ss ON sr.service_id = ss.id 
            JOIN users u ON sr.user_id = u.id WHERE u.id = ?`;
            const [services] = await readDb.query(query,[userId]);
            return services;
        } catch (error) {
            console.log(error)
            throw new Error('Error fetching service requests.');
        }
    }

    //remarks
    static async addServiceRequestRemark(remarkData) {
        try {
            const {
                status,
                user_id,
                service_request_id,
                remark
                // thumbnail,
            } = remarkData;

            const query =
                'INSERT INTO request_remarks ( status, user_id, service_request_id, remark ) VALUES (?, ?, ?, ?)';
            const values = [
                status,
                user_id,
                service_request_id,
                remark
            ];

            const [result] = await writeDb.query(query, values);
            return result.affectedRows > 0 ? result.insertId : false;
        } catch (error) {
            console.log(error)
            throw new Error('Error adding service request.');
        }
    }
    static async getServiceRequestRemarks(service_request_id) {
        try {
            const query = `SELECT rr.*,u.name as user
            FROM request_remarks rr 
            LEFT OUTER JOIN users u ON rr.user_id = u.id WHERE rr.service_request_id = ${service_request_id}`;
            const [remarks] = await readDb.query(query);
            return remarks;
        } catch (error) {
            console.log(error)
            throw new Error('Error fetching service requests.');
        }
    }
}
module.exports = ServiceModel