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
}
module.exports = ServiceModel