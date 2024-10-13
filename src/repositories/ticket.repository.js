import TicketModel from "../models/ticket.model.js";


class TicketRepository {
    async crearTicket(ticketData) {
        try {
            const ticket = new TicketModel(ticketData);
            await ticket.save();
            return ticket;
        } catch (error) {
            throw new Error("Error");
        }
    }
}

export default TicketRepository;