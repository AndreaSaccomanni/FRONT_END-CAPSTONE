import logoWhatsapp from "/src/assets/images/logoWhatsapp.png";
const WhatsappIcon = () => {
  return (
    <>
      <a href="https://wa.me/3772082714" className="whatsapp">
        <img
          src={logoWhatsapp}
          alt="Chatta su WhatsApp"
          style={{
            width: "40px",
            height: "40px",
            objectFit: "contain"
          }}
        />
      </a>
    </>
  );
};
export default WhatsappIcon;
