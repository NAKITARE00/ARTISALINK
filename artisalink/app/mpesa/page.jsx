// 'use Client'
// import IntaSend from "intasend-node";

// let intasend = new IntaSend(
//     `${process.env.INTASEND_PUBKEY}`,
//     `${process.env.INTASEND_SECKEY}`,
//     true,
// );

// const Mpesa = () => {

//     const onClickHandler = async (e) => {
//         e.preventDefault()
//         let collection = intasend.collection();
//         collection
//             .mpesaStkPush({
//                 first_name: 'Joe',
//                 last_name: 'Doe',
//                 email: 'joe@doe.com',
//                 host: 'https://8b3c-41-90-172-56.ngrok-free.app ',
//                 amount: 1,
//                 phone_number: '',
//                 api_ref: 'test-' + Date.now(),
//             })
//             .then((resp) => {
//                 console.log('Payment initiated:', resp);
//             })
//             .catch((err) => {
//                 console.error('Payment error:', err);
//             });
//     }
//     return (
//         <div>
//             <button onClick={onClickHandler}>
//                 MPESA
//             </button>
//         </div>
//     )

// }

// export default Mpesa

